import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  onImageSelected(event: any) {
    const file = event.target.files[0];
    this.imagenSeleccionada.emit(file);
  }

  subirImagen() {
    this.imagenSubida.emit();
  }
}
