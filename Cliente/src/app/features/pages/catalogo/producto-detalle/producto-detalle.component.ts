import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/models/carrito';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html'
})
export class ProductoDetalleComponent {
  @Input() producto: any = null;
  @Input() isAdmin: boolean = false;
  @Input() timestamp!: number;

  @Output() imagenSeleccionada = new EventEmitter<File>();
  @Output() imagenSubida = new EventEmitter<void>();


  cantidad: number = 1;

  constructor(private productService: ProductService, private carritoService: CarritoService, private router: Router) { }



  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://res.cloudinary.com/dlish6q5r/image/upload/v1743873476/no-imagen_jyqyup.png'; // Ruta local a imagen default
  }  




  agregarAlCarrito(): void {
    const item: Carrito = {
      idProducto: this.producto._id,
      codigo: this.producto.Codigo,
      cantidad: this.cantidad
    };
  
    this.carritoService.addToCart(item).subscribe({
      next: () => {
        alert('Producto agregado al carrito');
      },
      error: (error) => {
        console.error('Error al agregar al carrito:', error);
        alert('Error al agregar al carrito');
      }
    });
  }
  
  irAEditar() {
    if (this.producto && this.producto._id) {
      this.router.navigate(['/admin/productos', this.producto._id]);
    }
    
  }

}
