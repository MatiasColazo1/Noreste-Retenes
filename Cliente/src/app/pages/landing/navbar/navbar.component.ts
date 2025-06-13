import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isScrolled = false;

  @HostListener('window:scroll', [])
  @HostListener('window:resize', [])
  onWindowScroll() {
    const isMobile = window.innerWidth < 992; // Bootstrap breakpoint for lg
    const scrolledEnough = window.scrollY > 50;

    this.isScrolled = isMobile || scrolledEnough;
  }

  ngOnInit() {
    this.onWindowScroll(); // Ejecuta al iniciar para detectar si ya está en móvil
  }
}
