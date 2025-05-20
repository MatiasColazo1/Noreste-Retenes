import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { User } from 'src/app/models/user'; // Asegúrate de importar correctamente

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

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  onRegister() {
    console.log('Enviando datos del usuario:', this.user);
    this.authService.register(this.user).subscribe({
      next: (response) => {
        this.notificationService.success(response.message || 'Registro exitoso');
        this.router.navigate(['/login']); // ✅ Redirección después del registro
      },
      error: (error) => {
        const message = error.error?.message || 'Error al registrarse';
        const detalles = error.error?.details || [];

        if (detalles.length > 0) {
          detalles.forEach((detalle: string) => {
            this.notificationService.error(detalle.trim());
          });
        } else {
          this.notificationService.error(message);
        }
      }
    });
  }
}
