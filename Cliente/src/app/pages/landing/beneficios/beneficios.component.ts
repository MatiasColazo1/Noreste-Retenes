import { AfterViewInit, Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements AfterViewInit {
ngAfterViewInit() {
  const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  tooltipElements.forEach((el) => {
    const element = el as HTMLElement; // 👈 casteamos acá

    const tooltipInstance = new bootstrap.Tooltip(element, {
      trigger: 'manual'
    });

    const showOnce = () => {
      tooltipInstance.show();
      element.removeEventListener('mouseenter', showOnce);
    };

    element.addEventListener('mouseenter', showOnce);
  });
}

}