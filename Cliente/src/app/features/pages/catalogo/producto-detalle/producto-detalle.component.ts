import { Component, Input, Output, EventEmitter } from '@angular/core';
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

  nuevaEquivalencia: string = '';

  constructor(private productService: ProductService) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.imagenSeleccionada.emit(file);
  }

  subirImagen() {
    this.imagenSubida.emit();
  }

  agregarEquivalencia() {
    if (!this.nuevaEquivalencia.trim()) return;

    this.productService.addEquivalencia(this.producto._id, this.nuevaEquivalencia).subscribe({
      next: () => {
        if (!this.producto.equivalencias) {
          this.producto.equivalencias = [];
        }

        this.producto.equivalencias.push(this.nuevaEquivalencia);
        this.nuevaEquivalencia = '';
      },
      error: (err) => {
        console.error('Error al agregar equivalencia:', err);
      }
    });
  }

  eliminarEquivalencia(eq: string) {
    this.productService.removeEquivalencia(this.producto._id, eq).subscribe({
      next: () => {
        this.producto.equivalencias = this.producto.equivalencias?.filter((e: string) => e !== eq) || [];
      },
      error: (err) => {
        console.error('Error al eliminar equivalencia:', err);
      }
    });
  }
}
