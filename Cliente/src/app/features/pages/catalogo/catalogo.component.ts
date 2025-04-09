import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  
  constructor(public  authService: AuthService, private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  // Cargar productos con paginación
  loadProducts() {
    this.productService.getProducts(this.currentPage, this.limit).subscribe(
      (data) => {
        this.products = data;
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  selectProduct(id: string) {
    this.productService.getProductById(id).subscribe(product => {
      console.log('Producto recibido:', product);
      this.selectedProduct = product;
    });
  }
  // Cambiar de página
  changePage(page: number) {
    this.currentPage = page;
    this.loadProducts();
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
}}
}
