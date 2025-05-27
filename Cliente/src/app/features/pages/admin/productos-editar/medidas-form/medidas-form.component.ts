import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-medidas-form',
  templateUrl: './medidas-form.component.html',
  styleUrls: ['./medidas-form.component.css']
})
export class MedidasFormComponent {
  @Input() interior!: string;
  @Input() exterior!: string;
  @Input() ancho!: string;
  @Input() modoEdicion = false;

  @Output() medidasChange = new EventEmitter<{
    INTERIOR: string;
    EXTERIOR: string;
    ANCHO: string;
  }>();

  emitirCambios() {
    this.medidasChange.emit({
      INTERIOR: this.interior,
      EXTERIOR: this.exterior,
      ANCHO: this.ancho
    });
  }
}
