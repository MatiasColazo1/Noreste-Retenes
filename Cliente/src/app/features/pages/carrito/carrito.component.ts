import { Component, OnInit } from '@angular/core';
import { Carrito } from 'src/app/models/carrito';
import { AuthService } from 'src/app/services/auth.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  carrito: Carrito[] = [];

  constructor(private carritoService: CarritoService, private pdfService: PdfService, private authService: AuthService) {}

ngOnInit(): void {
  // Forzar que se recargue el carrito al iniciar el componente
  this.carritoService.loadCart(); // ⚠️ Hacelo público si es necesario

  this.carritoService.getCarritoObservable().subscribe({
    next: (items) => {
      this.carrito = items;
    },
    error: (err) => {
      console.error('Error al cargar el carrito:', err);
    },
  });
}


  eliminarDelCarrito(idProducto: string): void {
    this.carritoService.removeFromCart(idProducto).subscribe();
  }

  vaciarCarrito(): void {
    this.carritoService.clearCart().subscribe();
  }

  generarPDF() {
    const user = this.authService.getUser();

    if (!user) {
      console.error('No se encontró el ID del usuario.');
      return;
    }
    
    const userId = user.id; // 

    this.pdfService.generarPDF(userId).subscribe(blob => {
      const file = new Blob([blob], { type: 'application/pdf' });
  
      // Opción 1: abrir en nueva pestaña
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
  
      // Opción 2: descargar
      // const link = document.createElement('a');
      // link.href = fileURL;
      // link.download = 'carrito.pdf';
      // link.click();
    }, error => {
      console.error('Error al generar PDF:', error);
    });
  }

  calcularTotal(): number {
  return this.carrito.reduce((acc, item) => acc + (item.precioFinal * item.cantidad), 0);
}

  
  
}