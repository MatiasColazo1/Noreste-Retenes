import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';


@Component({
  selector: 'app-productos-admin',
  templateUrl: './productos-admin.component.html',
  styleUrls: ['./productos-admin.component.css']
})
export class ProductosAdminComponent {
  selectedFile: File | null = null;
  selectedPriceFile: File | null = null;

 constructor(
    public authService: AuthService,
    private productService: ProductService
  ) {}

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
}