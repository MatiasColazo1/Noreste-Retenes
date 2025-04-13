import { Component, EventEmitter, Output } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent {
  codigo: string = '';

  @Output() buscarPorCodigo = new EventEmitter<string>();

  onBuscar() {
    this.buscarPorCodigo.emit(this.codigo.trim());
  }
}

