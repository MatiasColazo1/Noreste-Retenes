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
        console.log(response); // Verifica que `role` y `user` estén presentes aquí
  
        // Guarda el token, el role y el usuario completo en localStorage
        this.authService.saveAuthData(response.token, response.user.role);
        this.authService.saveUser(response.user); // 👈 Guardamos el usuario completo

          this.notificationService.success('Inicio de sesión exitoso');
  
        this.router.navigate(['/catalogo']); // Redirige después de login
      },
      error: (err) => {
        const msg = err.error.message || 'Error al iniciar sesión';
        this.notificationService.error(msg); // Muestra el mensaje de error
      }
    });
  }
  
}