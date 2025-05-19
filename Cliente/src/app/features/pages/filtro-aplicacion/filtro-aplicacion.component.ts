import { Component, OnInit } from '@angular/core';
import { AplicacionService } from 'src/app/services/aplicacion.service';

@Component({
  selector: 'app-filtro-aplicacion',
  templateUrl: './filtro-aplicacion.component.html',
  styleUrls: ['./filtro-aplicacion.component.css']
})
export class FiltroAplicacionComponent implements OnInit {
  marcas: string[] = [];
  modelos: string[] = [];
  rubros: string[] = [];
  descripciones: string[] = [];
  productosFiltrados: any[] = [];

  marcaSeleccionada: string = '';
  modeloSeleccionado: string = '';
  rubroSeleccionado: string = '';
  descripcionSeleccionada: string = '';
  mostrarResultados: boolean = false;

  constructor(private aplicacionService: AplicacionService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token'); // o sessionStorage, según corresponda

    if (token) {
      this.aplicacionService.getMarcasUnicas(token).subscribe({
        next: (data) => this.marcas = data,
        error: (err) => console.error('Error al obtener marcas', err)
      });
    } else {
      console.error('Token no disponible');
    }
  }

  onMarcaChange(): void {
    this.modeloSeleccionado = '';
    this.modelos = [];

    const token = localStorage.getItem('token');

    if (this.marcaSeleccionada && token) {
      this.aplicacionService.getModelosPorMarca(this.marcaSeleccionada, token).subscribe({
        next: (data) => this.modelos = data,
        error: (err) => console.error('Error al obtener modelos', err)
      });
    } else {
      console.error('Marca o token no disponible');
    }
  }

  onModeloChange(): void {
    console.log('Modelo seleccionado:', this.modeloSeleccionado);

    this.rubros = [];
    this.rubroSeleccionado = '';

    const token = localStorage.getItem('token');

    if (this.marcaSeleccionada && this.modeloSeleccionado && token) {
      this.aplicacionService.getRubrosPorMarcaYModelo(this.marcaSeleccionada, this.modeloSeleccionado, token).subscribe({
        next: (data) => this.rubros = data,
        error: (err) => console.error('Error al obtener rubros', err)
      });
    } else {
      console.error('Marca, modelo o token no disponible');
    }
  }

  onRubroChange(): void {
    this.descripciones = [];
    this.descripcionSeleccionada = '';

    const token = localStorage.getItem('token');

    if (this.marcaSeleccionada && this.modeloSeleccionado && this.rubroSeleccionado && token) {
      this.aplicacionService.getDescripcionesPorMarcaModeloYRubro(
        this.marcaSeleccionada,
        this.modeloSeleccionado,
        this.rubroSeleccionado,
        token
      ).subscribe({
        next: (data) => this.descripciones = data,
        error: (err) => console.error('Error al obtener descripciones', err)
      });
    } else {
      console.error('Marca, modelo, rubro o token no disponible');
    }
  }

  buscarProductos(): void {
  const token = localStorage.getItem('token');

  if (
    this.marcaSeleccionada &&
    this.modeloSeleccionado &&
    this.rubroSeleccionado &&
    this.descripcionSeleccionada &&
    token
  ) {
    this.aplicacionService.getProductosFiltrados(
      this.marcaSeleccionada,
      this.modeloSeleccionado,
      this.rubroSeleccionado,
      this.descripcionSeleccionada,
      token
    ).subscribe({
      next: (data) => {
        this.productosFiltrados = data;
        this.mostrarResultados = true;
        console.log('Productos filtrados:', data);
      },
      error: (err) => {
        console.error('Error al obtener productos filtrados', err);
        this.mostrarResultados = false;
      }
    });
  } else {
    console.error('Faltan filtros o token para buscar productos');
    this.mostrarResultados = false;
  }
}
productoSeleccionado: any = null;

verDetalle(producto: any): void {
  this.productoSeleccionado = producto;
}
}




