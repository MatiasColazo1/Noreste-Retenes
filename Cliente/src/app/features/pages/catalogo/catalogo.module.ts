import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './catalogo.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    CatalogoComponent,
    ProductoDetalleComponent,
    FiltersComponent,

  ],
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    FormsModule, SharedModule,
  ]
})
export class CatalogoModule { }