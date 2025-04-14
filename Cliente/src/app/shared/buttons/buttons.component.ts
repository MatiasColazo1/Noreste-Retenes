import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.css']
})

export class ButtonsComponent {

  @Input() text: string = '';
  @Input() type: 'primary' | 'secondary' | 'icon' = 'primary';
  @Input() icon?: string;
  @Input() route?: string;
  @Input() isAdmin?: boolean;
  @Output() buttonClick = new EventEmitter<void>(); // 👈

  constructor(private router: Router) {}

  handleClick() {
    this.buttonClick.emit(); // emitir evento
    if (this.route) {
      this.router.navigate([this.route]);
    }
  }
}