import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-identificador-form',
  templateUrl: './identificador-form.component.html',
  styleUrls: ['./identificador-form.component.css']
})
export class IdentificadorFormComponent {
  @Input() prefijo!: string;
  @Input() codigo!: string;
  @Input() modoEdicion = false;

  @Output() identificadorChange = new EventEmitter<{
    Prefijo: string;
    Codigo: string;
  }>();

  emitirCambios() {
    this.identificadorChange.emit({
      Prefijo: this.prefijo,
      Codigo: this.codigo
    });
  }
}
