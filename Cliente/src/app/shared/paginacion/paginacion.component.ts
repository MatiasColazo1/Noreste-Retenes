import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent {
  @Input() currentPage!: number;
  @Input() hasNextPage!: boolean;
  @Input() totalPages!: number;


  @Output() pageChanged = new EventEmitter<number>();

  cambiarPagina(pagina: number) {
    this.pageChanged.emit(pagina);
  }
}
