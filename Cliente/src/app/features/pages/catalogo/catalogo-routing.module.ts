import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogoComponent } from './catalogo.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { PerfilUserComponent } from './perfil-user/perfil-user.component';

const routes: Routes = [
  { path: 'catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
  { path: 'perfil', component: PerfilUserComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogoRoutingModule { }