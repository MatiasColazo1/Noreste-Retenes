import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-generales-form',
  templateUrl: './datos-generales-form.component.html',
  styleUrls: ['./datos-generales-form.component.css']
})
export class DatosGeneralesFormComponent {
  @Input() producto: any;
}