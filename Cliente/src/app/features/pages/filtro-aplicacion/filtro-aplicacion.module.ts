import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FiltroAplicacionComponent } from './filtro-aplicacion.component';
import { FormsModule } from '@angular/forms';
import { FiltroAplicacionRoutingModule } from './filtro-aplicacion-routing.module';
import { ProductoDetalleComponent } from '../catalogo/producto-detalle/producto-detalle.component';
import { CatalogoModule } from '../catalogo/catalogo.module';

@NgModule({
  declarations: [FiltroAplicacionComponent],
  imports: [
    CommonModule,
    FormsModule,
    FiltroAplicacionRoutingModule,
    CatalogoModule
  ]
})
export class FiltroAplicacionModule { }
