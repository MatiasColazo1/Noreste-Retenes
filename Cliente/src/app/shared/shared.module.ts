import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from './buttons/buttons.component';
import { PaginacionComponent } from './paginacion/paginacion.component';



@NgModule({
  declarations: [ButtonsComponent, PaginacionComponent],
  imports: [CommonModule],
  exports: [ButtonsComponent] // 👈 Esto lo hace reutilizable
})
export class SharedModule { }
