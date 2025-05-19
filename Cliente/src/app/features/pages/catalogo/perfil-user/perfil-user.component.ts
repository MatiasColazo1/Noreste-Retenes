import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-perfil-user',
  templateUrl: './perfil-user.component.html',
  styleUrls: ['./perfil-user.component.css']
})
export class PerfilUserComponent implements OnInit {
user: User | null = null;

  constructor(private authService: AuthService) {}

 ngOnInit(): void {
  this.authService.getCurrentUser().subscribe({
    next: (data) => {
      console.log('Usuario cargado:', data);
      this.user = data.user; // ✅ Acceder al objeto "user" dentro del resultado
    },
    error: (err) => console.error('Error al obtener perfil:', err)
  });
}


}