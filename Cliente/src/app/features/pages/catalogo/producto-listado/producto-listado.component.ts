import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-producto-listado',
  templateUrl: './producto-listado.component.html',
    styleUrls: ['./producto-listado.component.css']
})
export class ProductosListadoComponent {
  @Input() products: Product[] = [];
  @Output() productSelected = new EventEmitter<string>();
  productoSeleccionado: string | null = null;

  seleccionarProducto(id: string) {
     this.productoSeleccionado = id;
    this.productSelected.emit(id);
  }
}
