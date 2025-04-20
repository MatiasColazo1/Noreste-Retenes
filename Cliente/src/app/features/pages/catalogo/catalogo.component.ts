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
  totalProducts: number = 0;
  selectedProduct: any = null;
  imageFile: File | null = null;
  timestamp: number = Date.now();

  selectedFile: File | null = null;
  selectedPriceFile: File | null = null;

  codigoBuscado: string = '';
  mensajeUsuario: string = '';
  constructor(
    public authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit() {
      this.codigoBuscado = '';
      this.mensajeUsuario = '';
      this.currentPage = 1;
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
    const valor = codigo.trim();
  
    if (!valor) {
      this.mensajeUsuario = '';
      this.currentPage = 1;
      this.cargarProductos();
      return;
    }
  
    this.productService.getProductsByPartialCode(valor, 1, this.limit).subscribe({
      next: (data) => {
        this.products = data.products;
        this.hasNextPage = data.products.length === this.limit;
        this.mensajeUsuario = data.products.length
          ? '' // Si se encuentran productos, limpio el mensaje
          : 'No se encontraron productos con ese código.';
      },
      error: (err) => {
        console.error('Error al buscar productos por código', err);
        this.products = [];
        this.hasNextPage = false;
        this.mensajeUsuario = 'Ocurrió un error al buscar productos.';
      }
    });
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
      this.mensajeUsuario = '';
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

  buscarPorEquivalencia(equivalencia: string) {
    const valor = equivalencia.trim();
  
    if (!valor) {
      this.mensajeUsuario = '';
      this.currentPage = 1;
      this.cargarProductos();
      return;
    }
  
    this.productService.getProductsByEquivalencia(valor, 1, this.limit).subscribe({
      next: (data: any) => {
        this.products = data.products;
        this.totalProducts = data.total;
        this.hasNextPage = data.products.length === this.limit;
        this.mensajeUsuario = data.products.length ? '' : 'No se encontraron productos con esa equivalencia.';
      },
      error: (error) => {
        console.error('Error al buscar por equivalencia', error);
        this.products = [];
        this.hasNextPage = false;
        this.mensajeUsuario = 'Ocurrió un error al buscar productos.';
      }
    });
  }

  buscarPorMedidas(filtros: { interior?: number, exterior?: number, ancho?: number }) {
    this.mensajeUsuario = '';
    this.products = [];
  
    const interior = filtros.interior && !isNaN(filtros.interior) ? filtros.interior : undefined;
    const exterior = filtros.exterior && !isNaN(filtros.exterior) ? filtros.exterior : undefined;
    const ancho = filtros.ancho && !isNaN(filtros.ancho) ? filtros.ancho : undefined;
  
    // Si todos los filtros están vacíos, traigo todos los productos
    if (interior === undefined && exterior === undefined && ancho === undefined) {
      this.currentPage = 1;
      this.cargarProductos();
      return;
    }
  
    this.productService.getProductsByMedidas(
      interior,
      exterior,
      ancho,
      this.currentPage,
      this.limit
    ).subscribe({
      next: (res: any) => {
        this.products = res.products;
        this.totalProducts = res.total;
        this.hasNextPage = this.products.length === this.limit;
        if (this.products.length === 0) {
          this.mensajeUsuario = 'No se encontraron productos con esas medidas.';
        }
      },
      error: (err) => {
        console.error('❌ Error al buscar por medidas:', err);
        this.mensajeUsuario = 'Ocurrió un error al buscar.';
      },
    });
  }
  
  
  
  resetearResultados() {
    this.codigoBuscado = '';
    this.selectedProduct = null;
    this.currentPage = 1;
    this.cargarProductos();
    this.mensajeUsuario = ' ';
  }
}
