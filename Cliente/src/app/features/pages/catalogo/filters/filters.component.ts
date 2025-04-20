import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  tipoFiltro: 'codigo' | 'equivalencia' | 'medidas' | null = null;

  codigo: string = '';
  equivalencia: string = '';

  @Output() buscarPorCodigo = new EventEmitter<string>();
  @Output() buscarPorEquivalencia = new EventEmitter<string>();
  @Output() buscarPorMedidas = new EventEmitter<{ interior?: number, exterior?: number, ancho?: number }>();

  interior?: number;
  exterior?: number;
  ancho?: number;

  setFiltro(tipo: 'codigo' | 'equivalencia' | 'medidas') {
    this.tipoFiltro = tipo;
  
    // Limpiar el valor del input anterior al cambiar de filtro
    if (tipo !== 'codigo') this.codigo = '';
    if (tipo !== 'equivalencia') this.equivalencia = '';
    if (tipo !== 'medidas') {
      this.interior = undefined;
      this.exterior = undefined;
      this.ancho = undefined;
    }
  }

  onBuscarCodigo() {
    this.buscarPorCodigo.emit(this.codigo.trim());
  }

  onBuscarEquivalencia() {
    this.buscarPorEquivalencia.emit(this.equivalencia.trim());
  }

  onBuscarMedidas() {
    this.buscarPorMedidas.emit({
      interior: this.interior,
      exterior: this.exterior,
      ancho: this.ancho,
    });
  }
}
