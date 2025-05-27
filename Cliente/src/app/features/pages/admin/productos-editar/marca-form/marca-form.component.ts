import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css']
})
export class MarcaFormComponent {
  @Input() producto: any;
  @Input() modoEdicion = false;

  @Output() marcaChange = new EventEmitter<string>();

  emitirCambios() {
    if (!this.producto) return;
    this.marcaChange.emit(this.producto.MARCA);
  }
}
