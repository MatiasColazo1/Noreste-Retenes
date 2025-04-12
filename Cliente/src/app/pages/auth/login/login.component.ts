import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router,  private notificationService: NotificationService) {}

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
  
    this.authService.login(this.loginData.email, this.loginData.password).subscribe({
      next: (response) => {
        console.log(response); // Verifica que `role` esté presente aquí
        // Guarda el token y el role en localStorage
        this.authService.saveAuthData(response.token, response.user.role);
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        const msg = err.error.message || 'Error al iniciar sesión';
        this.notificationService.error(msg); // 👈 Muestra 'Usuario no encontrado' o 'Contraseña incorrecta'
      }      
    });
}
}