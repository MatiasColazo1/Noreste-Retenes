import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  implements OnInit {
  form: FormGroup;
  token: string = '';
  message = '';
  error = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit(): void {
    if (this.form.invalid) return;
  
    const newPassword = this.form.value.newPassword;
  
    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: res => {
        this.notificationService.success(res.message, 'Contraseña actualizada');
        this.router.navigate(['/login']); // Reemplazá '/login' si usás otro path
      },
      error: err => {
        const errorMessage = err.error?.message || 'Error al restablecer contraseña';
        this.notificationService.error(errorMessage);
      }
    });
  }
}
