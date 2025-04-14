import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html'
})
export class PaginacionComponent {
  @Input() currentPage!: number;
  @Input() hasNextPage!: boolean;

  @Output() pageChanged = new EventEmitter<number>();

  cambiarPagina(pagina: number) {
    this.pageChanged.emit(pagina);
  }
}
