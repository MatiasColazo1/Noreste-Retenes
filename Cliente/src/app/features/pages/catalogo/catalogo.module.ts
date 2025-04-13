import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './catalogo.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CatalogoComponent,
    ProductoDetalleComponent,
    FiltersComponent,
  ],
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    FormsModule
  ]
})
export class CatalogoModule { }