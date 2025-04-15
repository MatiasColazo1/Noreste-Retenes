import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';

const routes: Routes = [
  { path: 'catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
  { path: 'producto/:id', component: ProductoDetalleComponent, canActivate: [AuthGuard] }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule { }