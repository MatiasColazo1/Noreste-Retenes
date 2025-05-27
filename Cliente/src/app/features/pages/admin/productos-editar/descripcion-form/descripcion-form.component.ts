import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-descripcion-form',
  templateUrl: './descripcion-form.component.html',
  styleUrls: ['./descripcion-form.component.css']
})
export class DescripcionFormComponent {
  @Input() descripcion!: string;
  @Input() modoEdicion = false;

  @Output() descripcionChange = new EventEmitter<string>();

  emitirCambios() {
    this.descripcionChange.emit(this.descripcion);
  }
}
