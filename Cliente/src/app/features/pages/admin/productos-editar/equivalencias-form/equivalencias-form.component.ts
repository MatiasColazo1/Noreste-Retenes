import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-equivalencias-form',
  templateUrl: './equivalencias-form.component.html',
})
export class EquivalenciasFormComponent {
  @Input() equivalencias: string[] = [];
  @Input() productoId!: string;

  @Output() equivalenciasChange = new EventEmitter<string[]>();

  nuevaEquivalencia: string = '';
  editandoIndice: number | null = null;
  equivalenciaEditada: string = '';

  constructor(private productService: ProductService) {}

  agregarEquivalencia() {
    const valor = this.nuevaEquivalencia.trim();
    if (!valor) return;

    this.productService.addEquivalencia(this.productoId, valor).subscribe({
      next: () => {
        this.equivalencias.push(valor);
        this.equivalenciasChange.emit(this.equivalencias);
        this.nuevaEquivalencia = '';
      },
      error: (err) => console.error('Error al agregar equivalencia:', err),
    });
  }

  eliminarEquivalencia(eq: string) {
    this.productService.removeEquivalencia(this.productoId, eq).subscribe({
      next: () => {
        this.equivalencias = this.equivalencias.filter(e => e !== eq);
        this.equivalenciasChange.emit(this.equivalencias);
      },
      error: (err) => console.error('Error al eliminar equivalencia:', err),
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

  guardarEdicionEquivalencia(eqAnt: string, index: number) {
    const nueva = this.equivalenciaEditada.trim();
    if (!nueva || nueva === eqAnt) return this.cancelarEdicion();

    this.productService.updateEquivalencia(this.productoId, eqAnt, nueva).subscribe({
      next: () => {
        this.equivalencias[index] = nueva;
        this.equivalenciasChange.emit(this.equivalencias);
        this.cancelarEdicion();
      },
      error: (err) => console.error('Error al actualizar equivalencia:', err),
    });
  }
}
