import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuario-detalles',
  templateUrl: './usuario-detalles.component.html',
  styleUrls: ['./usuario-detalles.component.css']
})
export class UsuarioDetallesComponent implements OnInit {
  user: User = {} as User;
  userBackup: User = {} as User;  // Copia de respaldo de los datos originales
  isEditing = false;  // Estado para el modo de edición

  constructor(private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data.user;  // Asegúrate de que la respuesta tenga la propiedad `user`
          this.userBackup = { ...data.user }; // Guardar una copia de los datos originales
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
        }
      });
    }
  }

  toggleEdit(): void {
    if (this.isEditing) {
      // Si se cancela la edición, revertir a los datos originales
      this.user = { ...this.userBackup };
    } else {
      // Convertir fechaNacimiento a un string con formato "yyyy-MM-dd" cuando se empieza a editar
      this.user.fechaNacimiento = new Date(this.user.fechaNacimiento).toISOString().split('T')[0];
    }
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    const userId = this.route.snapshot.paramMap.get('id');

    if (userId) {
        const updatedUser = { ...this.user };

        // Eliminar password antes de enviarlo al backend
        if (updatedUser.hasOwnProperty("password")) {
            delete updatedUser.password;
        }

        this.authService.updateUserById(userId, updatedUser).subscribe({
            next: (data) => {
                console.log('Usuario actualizado:', data);
                this.isEditing = false;  
                this.userBackup = { ...this.user };
            },
            error: (err) => {
                console.error('Error al guardar el usuario:', err);
            }
        });
    }
}
}