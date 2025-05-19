import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule) },
  { path: '', loadChildren: () => import('./features/pages/catalogo/catalogo.module').then(m => m.CatalogoModule) },
  { path: 'admin', loadChildren: () => import('./features/pages/admin/admin.module').then(m => m.AdminModule) },
  { path: 'filtro-aplicacion', loadChildren: () => import('./features/pages/filtro-aplicacion/filtro-aplicacion.module').then(m => m.FiltroAplicacionModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }