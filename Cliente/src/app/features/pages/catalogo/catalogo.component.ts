import { Component, OnInit } from '@angular/core';
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
  hasNextPage: boolean = true;

  selectedProduct: any = null;
  imageFile: File | null = null;
  timestamp: number = Date.now();

  selectedFile: File | null = null;
  selectedPriceFile: File | null = null;

  codigoBuscado: string = '';

  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  logout() {
    this.authService.logout();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  uploadFile() {
    if (this.selectedFile) {
      this.productService.uploadExcel(this.selectedFile).subscribe({
        next: () => {
          alert('📂 Archivo subido correctamente');
          window.location.reload();
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
        next: () => {
          alert('💸 Archivo de precios subido correctamente');
          window.location.reload();
        },
        error: (err) => {
          alert('❌ Error al subir el archivo de precios');
          console.error(err);
        },
      });
    }
  }

  buscarPorCodigoParcial(codigo: string) {
    this.codigoBuscado = codigo;
    this.getProductsByPartialCode(codigo, 1);
  }

  getProductsByPartialCode(codigo: string, pagina: number) {
    this.productService.getProductsByPartialCode(codigo, pagina, this.limit).subscribe({
      next: (data) => {
        this.products = data.products;
        this.currentPage = pagina;
        this.hasNextPage = (pagina * this.limit) < data.total;
      },
      error: (err) => {
        console.error('Error al buscar productos', err);
        this.products = [];
        this.hasNextPage = false;
      }
    });
  }

  changePage(pagina: number) {
    this.currentPage = pagina;

    if (this.codigoBuscado?.trim()) {
      this.getProductsByPartialCode(this.codigoBuscado, pagina);
    } else {
      this.cargarProductos();
    }
  }

  cargarProductos() {
    this.productService.getProducts(this.currentPage, this.limit).subscribe((response) => {
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
        Precio: productoConPrecio?.Precio
      };
    });
  }

  uploadProductImage() {
    if (!this.imageFile || !this.selectedProduct) return;

    const formData = new FormData();
    formData.append('file', this.imageFile);
    formData.append('upload_preset', 'mi_present');
    formData.append('folder', 'productos');

    fetch('https://api.cloudinary.com/v1_1/dlish6q5r/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const imageUrl = data.secure_url;

        this.productService.updateProductImage(this.selectedProduct._id, imageUrl).subscribe({
          next: (updatedProduct) => {
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
      });
  }
}
