import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Carrito } from 'src/app/models/carrito';
import { CarritoService } from 'src/app/services/carrito.service';
import { ProductService } from 'src/app/services/product.service';
import { AplicacionService } from 'src/app/services/aplicacion.service';
import { Aplicacion } from 'src/app/models/aplicacion';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html'
})
export class ProductoDetalleComponent implements OnInit, OnChanges {
  @Input() producto: any = null;
  @Input() isAdmin: boolean = false;
  @Input() timestamp!: number;

  @Output() imagenSeleccionada = new EventEmitter<File>();
  @Output() imagenSubida = new EventEmitter<void>();

  cantidad: number = 1;
  aplicaciones: Aplicacion[] = [];

  constructor(
    private productService: ProductService,
    private carritoService: CarritoService,
    private aplicacionService: AplicacionService,
    private router: Router
  ) {}

  ngOnInit() {
     this.cargarAplicaciones();
    if (this.producto && this.producto._id) {
      const token = localStorage.getItem('token'); // Ajustalo según cómo guardás tu token
      if (token) {
        this.aplicacionService.getAplicacionesByProducto(this.producto._id, token).subscribe({
          next: (data) => this.aplicaciones = data,
          error: (err) => console.error('Error al obtener aplicaciones', err)
        });
      }
    }
  }

    ngOnChanges(changes: SimpleChanges) {
    if (changes['producto'] && changes['producto'].currentValue?._id) {
      this.cargarAplicaciones();
    }
  }

   private cargarAplicaciones(): void {
    this.aplicaciones = []; // Limpiar para evitar que se muestre la anterior momentáneamente
    const token = localStorage.getItem('token');
    if (this.producto && this.producto._id && token) {
      this.aplicacionService.getAplicacionesByProducto(this.producto._id, token).subscribe({
        next: (data) => this.aplicaciones = data,
        error: (err) => console.error('Error al obtener aplicaciones', err)
      });
    }
  }


  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://res.cloudinary.com/dlish6q5r/image/upload/v1747076097/download_vbzenr.jpg';
  }

  agregarAlCarrito(): void {
    const item: Carrito = {
      idProducto: this.producto._id,
      codigo: this.producto.Codigo,
      cantidad: this.cantidad
    };

    this.carritoService.addToCart(item).subscribe({
      next: () => alert('Producto agregado al carrito'),
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
