import { AfterViewInit, Component } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-beneficios',
  templateUrl: './beneficios.component.html',
  styleUrls: ['./beneficios.component.css']
})
export class BeneficiosComponent implements AfterViewInit {
  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl: HTMLElement) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }
}