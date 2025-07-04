import { AfterViewInit, Component } from '@angular/core';


@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent {
productosIzquierda = [
  { nombre: 'Retenes', imagen: 'assets/product/p-retenes.webp' },
  { nombre: 'Rodamientos', imagen: 'assets/product/p-rodamientos.webp' }
];

productosGrilla = [
  { nombre: 'Correas', imagen: 'assets/product/p-correas.webp' },
  { nombre: 'Crapodinas', imagen: 'assets/product/p-crapodinas.webp' },
  { nombre: 'Tensores de Correa  ', imagen: 'assets/product/p-tensores.webp' },
  { nombre: 'Abrazaderas', imagen: 'assets/product/p-abrazaderas.webp' },
  { nombre: 'Mangueras', imagen: 'assets/product/p-mangueras.webp' },
  { nombre: 'Crucetas', imagen: 'assets/product/p-crucetas.webp' },
  { nombre: 'Grasa de Litio', imagen: 'assets/product/p-grasa.webp' },
  { nombre: 'Masas de Rueda', imagen: 'assets/product/p-masas.webp' },
  { nombre: 'Kit de Distribución', imagen: 'assets/product/p-distr.webp' },
  { nombre: 'Autocentrantes', imagen: 'assets/product/p-autocentrantes.webp' },
  { nombre: 'Centro de Cardan', imagen: 'assets/product/p-cardan.webp' },
  { nombre: 'Cadenas de Distribución', imagen: 'assets/product/p-cadenas.webp' }
];
getJustifyClass(nombre: string): string {
  return nombre.length > 19 ? 'justify-content-end' : 'justify-content-center';
}

}
