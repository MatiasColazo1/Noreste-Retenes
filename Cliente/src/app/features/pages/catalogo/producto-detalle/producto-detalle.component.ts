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
  editandoIndice: number | null = null;
  equivalenciaEditada: string = '';

  constructor(private productService: ProductService) { }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.imagenSeleccionada.emit(file);
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://res.cloudinary.com/dlish6q5r/image/upload/v1743873476/no-imagen_jyqyup.png'; // Ruta local a imagen default
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

  editarEquivalencia(eq: string, index: number) {
    this.editandoIndice = index;
    this.equivalenciaEditada = eq;
  }

  cancelarEdicion() {
    this.editandoIndice = null;
    this.equivalenciaEditada = '';
  }

  guardarEdicionEquivalencia(equivalenciaAntigua: string, index: number) {
    const nuevaEquivalencia = this.equivalenciaEditada.trim();

    if (!nuevaEquivalencia || nuevaEquivalencia === equivalenciaAntigua) {
      this.cancelarEdicion();
      return;
    }

    this.productService.updateEquivalencia(this.producto._id, equivalenciaAntigua, nuevaEquivalencia).subscribe({
      next: () => {
        this.producto.equivalencias[index] = nuevaEquivalencia;
        this.cancelarEdicion();
      },
      error: (err) => {
        console.error('Error al actualizar equivalencia:', err);
      }
    });
  }
}
