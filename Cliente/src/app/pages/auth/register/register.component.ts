import { Component } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

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

  constructor(private authService: AuthService, private notificationService: NotificationService) {}

  onRegister() {
    console.log('Enviando datos del usuario:', this.user);
    this.authService.register(this.user).subscribe({
        next: (response) => {
            this.notificationService.success(response.message || 'Registro exitoso');
        },
        error: (error) => {
            // Acceder a la respuesta estructurada del backend
            const message = error.error?.message || 'Error al registrarse';
            const detalles = error.error?.details || [];

            if (detalles.length > 0) {
                // Mostrar cada error como un toast
                detalles.forEach((detalle: string) => {
                    this.notificationService.error(detalle.trim());
                });
            } else {
                // Si no hay detalles, mostrar un solo toast con el mensaje de error principal
                this.notificationService.error(message);
            }
        }
    });
}

  
  
  }


