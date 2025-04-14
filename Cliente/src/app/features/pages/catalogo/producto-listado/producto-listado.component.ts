import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-producto-listado',
  templateUrl: './producto-listado.component.html'
})
export class ProductosListadoComponent {
  @Input() products: Product[] = [];
  @Output() productSelected = new EventEmitter<string>();

  seleccionarProducto(id: string) {
    this.productSelected.emit(id);
  }
}
