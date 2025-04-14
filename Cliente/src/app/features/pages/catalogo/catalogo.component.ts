import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  products: Product[] = [];
  currentPage: number = 1;
  limit: number = 20;

  selectedProduct: any = null;
  selectedFile: File | null = null;
  selectedPriceFile: File | null = null;

  totalProductos: number = 0;
  codigoBuscado: string = '';

  hasNextPage: boolean = true;

  imageFile: File | null = null;
  timestamp: number = Date.now();
  constructor(public authService: AuthService, private productService: ProductService, private router: Router) { }

  ngOnInit() {
    this.productService.getProducts(this.currentPage, this.limit).subscribe((response) => {
      console.log('Datos recibidos:', response);
      this.products = response;

      this.hasNextPage = response.length === this.limit;
    });
  }

  selectProduct(id: string) {
    forkJoin({
      detalles: this.productService.getProductById(id),
      precios: this.productService.getProductsByUser()
    }).subscribe(({ detalles, precios }) => {
      const productoConPrecio = precios.find(p => p._id === id);

      this.selectedProduct = {
        ...detalles,
        Precio: productoConPrecio?.Precio // si lo encuentra, lo asigna; si no, deja undefined
      };
    });
  }
  // Cambiar de página
  changePage(pagina: number) {
    this.currentPage = pagina;

    if (this.codigoBuscado && this.codigoBuscado.trim() !== '') {
      this.getProductsByPartialCode(this.codigoBuscado, pagina);
    } else {
      this.productService.getProducts(this.currentPage, this.limit).subscribe((response) => {
        console.log('Datos recibidos:', response);
        this.products = response;

        this.hasNextPage = response.length === this.limit;
      });
    }
  }

  verDetalles(id: string) {
    this.router.navigate(['/producto', id]);
  }

  logout() {
    this.authService.logout();
  }
  // Manejar selección de archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }
  // Subir archivo Excel
  uploadFile() {
    if (this.selectedFile) {
      this.productService.uploadExcel(this.selectedFile).subscribe({
        next: (response) => {
          alert('📂 Archivo subido correctamente');
          window.location.reload(); // Recargar para actualizar la lista de productos
        },
        error: (err) => {
          alert('❌ Error al subir el archivo');
          console.error(err);
        },
      });
    }
  }

  onPriceFileSelected(event: any) {
    this.selectedPriceFile = event.target.files[0] || null;
  }

  uploadPrices() {
    if (this.selectedPriceFile) {
      this.productService.uploadPrices(this.selectedPriceFile).subscribe({
        next: (response) => {
          alert('💸 Archivo de precios subido correctamente');
          window.location.reload(); // Opcional, si querés refrescar los productos
        },
        error: (err) => {
          alert('❌ Error al subir el archivo de precios');
          console.error(err);
        },
      });
    }
  }
  // Buscar productos por código parcial con paginación
  getProductsByPartialCode(codigo: string | null = null, pagina: number = 1): void {
    this.productService.getProductsByPartialCode(codigo, pagina, this.limit).subscribe({
      next: (data) => {
        this.products = data.products;
        this.totalProductos = data.total;
        this.currentPage = pagina;

        const productosMostrados = pagina * this.limit;
        this.hasNextPage = productosMostrados < data.total;
      },
      error: (err) => {
        console.error('Error al buscar productos por código parcial', err);
        this.products = [];
        this.totalProductos = 0;
        this.hasNextPage = false;
      }
    });
  }
  // Este método lo usa <app-filters> para emitir el código a buscar
  buscarPorCodigoParcial(codigo: string) {
    this.codigoBuscado = codigo;
    this.getProductsByPartialCode(codigo, 1); // reinicia la paginación
  }

  // Selección de imagen
onImageSelected(event: any) {
  this.imageFile = event.target.files[0];
}

uploadProductImage() {
  if (!this.imageFile || !this.selectedProduct) return;

  const formData = new FormData();
  formData.append('file', this.imageFile);
  formData.append('upload_preset', 'mi_present'); // Reemplazá con tu upload_preset real
  formData.append('folder', 'productos');

  fetch('https://api.cloudinary.com/v1_1/dlish6q5r/image/upload', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log('URL subida a Cloudinary:', data.secure_url); // 👈
    
      const imageUrl = data.secure_url;
    
      this.productService.updateProductImage(this.selectedProduct._id, imageUrl).subscribe({
        next: (updatedProduct) => {
          console.log('Producto actualizado:', updatedProduct); // 👈
    
          alert('✅ Imagen actualizada correctamente');
          this.selectedProduct = {
            ...this.selectedProduct,
            Imagen: updatedProduct.product.Imagen
          };
          this.timestamp = Date.now();
          
          
        },
        error: (err) => {
          console.error('Error al actualizar imagen:', err);
          alert('❌ Error al actualizar imagen');
        }
      });
    })
    
}
}
