import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service'; // Asegurate que la ruta sea correcta

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  tipoFiltro: 'codigo' | 'equivalencia' | 'medidas' | null = null;

  codigo: string = '';
  equivalencia: string = '';

  interior?: number;
  exterior?: number;
  ancho?: number;
  nombreRubro?: string;

  rubros: string[] = [];

  @Output() buscarPorCodigo = new EventEmitter<string>();
  @Output() buscarPorEquivalencia = new EventEmitter<string>();
  @Output() buscarPorMedidas = new EventEmitter<{ interior?: number, exterior?: number, ancho?: number, nombreRubro?: string }>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarRubros();
  }

  setFiltro(tipo: 'codigo' | 'equivalencia' | 'medidas') {
    this.tipoFiltro = tipo;

    if (tipo !== 'codigo') this.codigo = '';
    if (tipo !== 'equivalencia') this.equivalencia = '';
    if (tipo !== 'medidas') {
      this.interior = undefined;
      this.exterior = undefined;
      this.ancho = undefined;
      this.nombreRubro = undefined;
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
      nombreRubro: this.nombreRubro,
    });
  }

  private cargarRubros() {
    this.productService.getRubros().subscribe({
      next: (res: string[]) => {
        this.rubros = res;
      },
      error: (err) => {
        console.error('Error al cargar rubros', err);
      },
    });
  }
}
