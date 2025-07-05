import { Component, Input } from '@angular/core';
import { Aplicacion } from 'src/app/models/aplicacion';

@Component({
  selector: 'app-aplicacion-lectura',
  templateUrl: './aplicacion-lectura.component.html',
  styleUrls: ['./aplicacion-lectura.component.css']
})
export class AplicacionLecturaComponent {
 @Input() aplicaciones: Aplicacion[] = [];
}
