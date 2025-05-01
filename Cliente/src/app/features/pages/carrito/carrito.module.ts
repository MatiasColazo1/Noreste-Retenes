import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoRoutingModule } from './carrito-routing.module';
import { FormsModule } from '@angular/forms'; // Por si usás formularios
import { CarritoComponent } from './carrito.component';

@NgModule({
  declarations: [CarritoComponent],
  exports: [CarritoComponent],
  imports: [
    CommonModule,
    FormsModule,
    CarritoRoutingModule
  ]
})
export class CarritoModule {}
