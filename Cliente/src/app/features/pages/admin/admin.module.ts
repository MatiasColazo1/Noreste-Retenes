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
import { ProductosEditarComponent } from './productos-editar/productos-editar.component';
import { EquivalenciasFormComponent } from './productos-editar/equivalencias-form/equivalencias-form.component';
import { ImagenUploaderComponent } from './productos-editar/imagen-uploader/imagen-uploader.component';
import { MedidasFormComponent } from './productos-editar/medidas-form/medidas-form.component';
import { IdentificadorFormComponent } from './productos-editar/identificador-form/identificador-form.component';
import { DescripcionFormComponent } from './productos-editar/descripcion-form/descripcion-form.component';
import { DatosGeneralesFormComponent } from './productos-editar/datos-generales-form/datos-generales-form.component';
import { MarcaFormComponent } from './productos-editar/marca-form/marca-form.component';

@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    UsuariosComponent,
    UsuarioDetallesComponent,
    ProductosAdminComponent,
    ProductosEditarComponent,
    EquivalenciasFormComponent,
    ImagenUploaderComponent,
    MedidasFormComponent,
    IdentificadorFormComponent,
    DescripcionFormComponent,
    DatosGeneralesFormComponent,
    MarcaFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule, SharedModule,
  ]
})
export class AdminModule { }