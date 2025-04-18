import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  tipoFiltro: 'codigo' | 'equivalencia' | null = null;

  codigo: string = '';
  equivalencia: string = '';

  @Output() buscarPorCodigo = new EventEmitter<string>();
  @Output() buscarPorEquivalencia = new EventEmitter<string>();

  setFiltro(tipo: 'codigo' | 'equivalencia') {
    this.tipoFiltro = tipo;
  
    // Limpiar el valor del input anterior al cambiar de filtro
    if (tipo === 'codigo') {
      this.equivalencia = '';
    } else if (tipo === 'equivalencia') {
      this.codigo = '';
    }
  }
  

  onBuscarCodigo() {
    this.buscarPorCodigo.emit(this.codigo.trim());
  }

  onBuscarEquivalencia() {
    this.buscarPorEquivalencia.emit(this.equivalencia.trim());
  }
}
