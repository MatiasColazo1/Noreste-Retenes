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
  hasNextPage: boolean = true;
  totalProducts: number = 0;
  selectedProduct: any = null;
  imageFile: File | null = null;
  timestamp: number = Date.now();

  selectedFile: File | null = null;
  selectedPriceFile: File | null = null;

  codigoBuscado: string = '';
  mensajeUsuario: string = '';

  lastSearchType: 'codigo' | 'equivalencia' | 'medidas' | null = null;
lastSearchParams: any = null;

  constructor(
    public authService: AuthService,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
      this.codigoBuscado = '';
      this.mensajeUsuario = '';
      this.currentPage = 1;
      this.cargarProductos();
      
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
      }
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
    this.codigoBuscado = valor;
  
    if (!valor) {
      this.mensajeUsuario = '';
      this.currentPage = 1;
      this.lastSearchType = null;
      this.cargarProductos();
      return;
    }
  
    this.lastSearchType = 'codigo';
    this.lastSearchParams = { codigo: valor };
  
    this.productService.getProductsByPartialCode(valor, 1, this.limit).subscribe({
      next: (data) => {
        this.products = data.products;
        this.hasNextPage = data.products.length === this.limit;
        this.mensajeUsuario = data.products.length ? '' : 'No se encontraron productos con ese código.';
      },
      error: () => {
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
  
    if (this.lastSearchType === 'codigo') {
      this.getProductsByPartialCode(this.lastSearchParams.codigo, pagina);
    } else if (this.lastSearchType === 'equivalencia') {
      this.productService.getProductsByEquivalencia(this.lastSearchParams.equivalencia, pagina, this.limit)
        .subscribe(/* manejar resultados */);
    } else if (this.lastSearchType === 'medidas') {
      this.buscarPorMedidas(this.lastSearchParams);
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
      precio: this.productService.getPrecioProductoById(id)
    }).subscribe(({ detalles, precio }: { detalles: Product, precio: any }) => {
      
      this.selectedProduct = {
        ...detalles,
        Precio: precio?.precioFinal || detalles.PrecioLista1,
        PrecioOriginal: precio?.precioOriginal,
        Descuento: precio?.descuentoAplicado
      };
  
      console.log("Detalles:", detalles);
      console.log("Precio con descuento:", precio);
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

    this.lastSearchType = 'equivalencia'; 
    this.lastSearchParams = { equivalencia: valor };
  
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

  buscarPorMedidas(filtros: { interior?: number, exterior?: number, ancho?: number, nombreRubro?: string }) {
    this.mensajeUsuario = '';
    this.products = [];
  
    const interior = filtros.interior && !isNaN(filtros.interior) ? filtros.interior : undefined;
    const exterior = filtros.exterior && !isNaN(filtros.exterior) ? filtros.exterior : undefined;
    const ancho = filtros.ancho && !isNaN(filtros.ancho) ? filtros.ancho : undefined;
    const nombreRubro = filtros.nombreRubro || undefined;
  
    if (interior === undefined && exterior === undefined && ancho === undefined && !nombreRubro) {
      this.currentPage = 1;
      this.cargarProductos();
      return;
    }

    this.lastSearchType = 'medidas';
this.lastSearchParams = { interior, exterior, ancho, nombreRubro };

  
    this.productService.getProductsByMedidas(
      interior,
      exterior,
      ancho,
      nombreRubro,
      this.currentPage,
      this.limit
    ).subscribe({
      next: (res: any) => {
        this.products = res.products;
        this.totalProducts = res.total;
        this.hasNextPage = this.products.length === this.limit;
        if (this.products.length === 0) {
          this.mensajeUsuario = 'No se encontraron productos con esos filtros.';
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
    this.lastSearchType = null;
    this.lastSearchParams = null;
    this.cargarProductos();
    this.mensajeUsuario = ' ';
  }
  
}
