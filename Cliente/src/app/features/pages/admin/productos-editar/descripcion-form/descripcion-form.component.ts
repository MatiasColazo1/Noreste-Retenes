import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-descripcion-form',
  templateUrl: './descripcion-form.component.html',
  styleUrls: ['./descripcion-form.component.css']
})
export class DescripcionFormComponent {
  @Input() descripcion!: string;
}
