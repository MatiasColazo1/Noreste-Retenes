import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-marca-form',
  templateUrl: './marca-form.component.html',
  styleUrls: ['./marca-form.component.css']
})
export class MarcaFormComponent {
  @Input() producto: any;
}
