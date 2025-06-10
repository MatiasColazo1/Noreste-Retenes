import { AfterViewInit, Component } from '@angular/core';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
productosIzquierda = [
  { nombre: 'Retenes', imagen: 'assets/imagenes/retenes.png' },
  { nombre: 'Rodamientos', imagen: 'assets/imagenes/rodamientos.png' }
];

productosGrilla = [
  { nombre: 'Correas', imagen: '...' },
  { nombre: 'Crapodinas', imagen: '...' },
  { nombre: 'Tensores de Correa', imagen: '...' },
  { nombre: 'Abrazaderas', imagen: '...' },
  { nombre: 'Mangueras', imagen: '...' },
  { nombre: 'Crucetas', imagen: '...' },
  { nombre: 'Grasa de Litio', imagen: '...' },
  { nombre: 'Masas de Rueda', imagen: '...' },
  { nombre: 'Kit de Distribución', imagen: '...' },
  { nombre: 'Autocentrantes', imagen: '...' },
  { nombre: 'Centro de Cardan', imagen: '...' },
  { nombre: 'Cadenas de Distribución', imagen: '...' }
];

}
