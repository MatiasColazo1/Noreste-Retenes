import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  users: any[] = [];
  currentPage: number = 1;
  limit: number = 10;
  hasNextPage: boolean = true;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getUsers(this.currentPage, this.limit).subscribe({
      next: (data) => {
        this.users = data.users || [];
        this.hasNextPage = this.users.length === this.limit;
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1) return;
    this.currentPage = nuevaPagina;
    this.loadUsers();
  }
}
