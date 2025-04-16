import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { UsuarioDetallesComponent } from './usuario-detalles/usuario-detalles.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductosAdminComponent } from './productos-admin/productos-admin.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsuariosComponent,
    UsuarioDetallesComponent,
    ProductosAdminComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule, SharedModule
  ]
})
export class AdminModule { }