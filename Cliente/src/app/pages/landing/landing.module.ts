import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingRoutingModule } from './landing-routing.module';
import { BannerComponent } from './banner/banner.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';

@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    BannerComponent,
    BeneficiosComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
