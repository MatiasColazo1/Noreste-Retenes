import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './catalogo.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { FiltersComponent } from './filters/filters.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductosListadoComponent } from './producto-listado/producto-listado.component';
import { CarritoModule } from '../carrito/carrito.module';


@NgModule({
  declarations: [
    CatalogoComponent,
    ProductosListadoComponent,
    ProductoDetalleComponent,
    FiltersComponent,

  ],
  imports: [
    CommonModule,
    CatalogoRoutingModule,
    FormsModule, SharedModule,
    CarritoModule
  ]
})
export class CatalogoModule { }