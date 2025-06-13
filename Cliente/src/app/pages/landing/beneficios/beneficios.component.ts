import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements AfterViewInit, OnDestroy {
private tooltipInstances: any[] = [];

  private routerSub!: Subscription;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    tooltipElements.forEach((el) => {
      const element = el as HTMLElement;

      const tooltipInstance = new bootstrap.Tooltip(element, {
        trigger: 'manual'
      });

      this.tooltipInstances.push(tooltipInstance);

      const showOnce = () => {
        tooltipInstance.show();
        element.removeEventListener('mouseenter', showOnce);
      };

      element.addEventListener('mouseenter', showOnce);
    });

    // Escuchar cambios de ruta
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.tooltipInstances.forEach((instance) => instance.hide());
      }
    });
  }

  ngOnDestroy() {
    this.tooltipInstances.forEach((instance) => instance.dispose());
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}