import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user: User = {
    nombre: '',
    apellido: '',
    tipoCliente: 'Mayorista',
    fechaNacimiento: '',
    cuit: '',
    direccion: '',
    domicilioEntrega: '',
    celular: '',
    ciudad: '',
    email: '',
    password: '',
  };

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.user).subscribe({
      next: (response) => {
        console.log('Registro exitoso', response);
        alert('Registro exitoso');
      },
      error: (error) => {
        console.error('Error al registrarse', error);
        alert('Error al registrarse');
      }
    });
  }
}

