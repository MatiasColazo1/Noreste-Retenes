import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-datos-generales-form',
  templateUrl: './datos-generales-form.component.html',
  styleUrls: ['./datos-generales-form.component.css']
})
export class DatosGeneralesFormComponent {
  @Input() producto: any;
  @Input() modoEdicion = false;

  @Output() datosChange = new EventEmitter<{
    PrecioLista1: number;
    PrecioLista2: number;
    NombreRubro: string;
    NombreSubRubro: string;
  }>();

  emitirCambios() {
    if (!this.producto) return;
    
    this.datosChange.emit({
      PrecioLista1: this.producto.PrecioLista1,
      PrecioLista2: this.producto.PrecioLista2,
      NombreRubro: this.producto.NombreRubro,
      NombreSubRubro: this.producto.NombreSubRubro
    });
  }
}