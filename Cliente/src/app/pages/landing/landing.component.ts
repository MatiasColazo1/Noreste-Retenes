import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  showSplash = true;

  ngOnInit() {
    // Bloquear scroll
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      this.showSplash = false;
      // Volver a permitir scroll
      document.body.style.overflow = '';
    }, 3000); // 3 segundos de splash
  }
}