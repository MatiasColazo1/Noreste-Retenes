import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-medidas-form',
  templateUrl: './medidas-form.component.html',
  styleUrls: ['./medidas-form.component.css']
})
export class MedidasFormComponent {
  @Input() interior!: string;
  @Input() exterior!: string;
  @Input() ancho!: string;
}
