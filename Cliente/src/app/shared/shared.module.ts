import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonsComponent } from './buttons/buttons.component';



@NgModule({
  declarations: [ButtonsComponent],
  imports: [CommonModule],
  exports: [ButtonsComponent] // 👈 Esto lo hace reutilizable
})
export class SharedModule { }
