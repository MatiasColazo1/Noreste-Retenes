import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FiltroAplicacionComponent } from './filtro-aplicacion.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { MayoristaGuard } from 'src/app/core/guards/mayorista.guard';

const routes: Routes = [
  { path: '', component: FiltroAplicacionComponent, canActivate: [AuthGuard, MayoristaGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FiltroAplicacionRoutingModule { }
