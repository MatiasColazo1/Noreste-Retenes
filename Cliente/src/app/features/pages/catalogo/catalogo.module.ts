import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogoComponent } from './catalogo.component';
import { CatalogoRoutingModule } from './catalogo-routing.module';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';

@NgModule({
  declarations: [
    CatalogoComponent,
    ProductoDetalleComponent,
  ],
  imports: [
    CommonModule,
    CatalogoRoutingModule
  ]
})
export class CatalogoModule { }