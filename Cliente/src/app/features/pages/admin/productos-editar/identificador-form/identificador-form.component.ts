import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-identificador-form',
  templateUrl: './identificador-form.component.html',
  styleUrls: ['./identificador-form.component.css']
})
export class IdentificadorFormComponent {
  @Input() prefijo!: string;
  @Input() codigo!: string;

  isEditing = false;
  editablePrefijo = '';

  // Simulación: cambiar a tu lógica real para validar admin
  esAdmin = true; // o usar algún AuthService real

  editar() {
    this.isEditing = true;
    this.editablePrefijo = this.prefijo;
  }

  guardar() {
    this.prefijo = this.editablePrefijo;
    this.isEditing = false;
    // Aquí podés emitir un evento o llamar a un servicio para persistir si hace falta
  }

  cancelar() {
    this.isEditing = false;
  }
}
