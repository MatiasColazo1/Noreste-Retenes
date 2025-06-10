import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingComponent } from './landing.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LandingRoutingModule } from './landing-routing.module';
import { BannerComponent } from './banner/banner.component';
import { BeneficiosComponent } from './beneficios/beneficios.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { FooterComponent } from './footer/footer.component';
import { MarcasComponent } from './marcas/marcas.component';
import { ProductosComponent } from './productos/productos.component';
import { AsesoramientoComponent } from './asesoramiento/asesoramiento.component';

@NgModule({
  declarations: [
    LandingComponent,
    NavbarComponent,
    BannerComponent,
    BeneficiosComponent,
    NosotrosComponent,
    FooterComponent,
    MarcasComponent,
    ProductosComponent,
    AsesoramientoComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
