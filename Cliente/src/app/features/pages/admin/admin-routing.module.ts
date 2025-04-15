import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard'; // Asegúrate de que esta ruta es correcta
import { AdminGuard } from 'src/app/core/guards/admin.guard';
import { UsuarioDetallesComponent } from './usuario-detalles/usuario-detalles.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard], 
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'usuario/:id', component: UsuarioDetallesComponent },
      { path: 'dashboard', component: DashboardComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }