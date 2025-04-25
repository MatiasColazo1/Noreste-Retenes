import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ProductService } from 'src/app/services/product.service';  // Asegúrate de importar el ProductService

@Component({
  selector: 'app-usuario-detalles',
  templateUrl: './usuario-detalles.component.html',
  styleUrls: ['./usuario-detalles.component.css']
})
export class UsuarioDetallesComponent implements OnInit {
  user: User = {} as User;
  userBackup: User = {} as User;
  isEditing = false;  // Aquí almacenamos los rubros obtenidos desde el backend
  productos: any[] = [];
  rubros: string[] = [];
  descuentos: { rubro: string; porcentaje: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
  
    if (userId) {
      this.authService.getUserById(userId).subscribe({
        next: (data) => {
          this.user = data.user;
          this.userBackup = { ...this.user };
          const descuentosRaw = this.user.descuentos || {};
          this.descuentos = Object.entries(descuentosRaw).map(([rubro, porcentaje]) => ({
            rubro,
            porcentaje
          }));
          
        },
        error: (err) => {
          console.error('Error al obtener el usuario:', err);
        }
      });
  
      this.productService.getRubros().subscribe({
        next: (rubros) => {
          this.rubros = rubros;
        },
        error: (err) => {
          console.error('Error al obtener rubros:', err);
        }
      });
    }
  }
  

  addDescuento(): void {
    this.descuentos.push({ rubro: '', porcentaje: 0 });
  }
  
  removeDescuento(index: number): void {
    this.descuentos.splice(index, 1);
  }
  
  



  toggleEdit(): void {
    if (this.isEditing) {
      this.user = { ...this.userBackup };  // Revertir cambios si se cancela la edición
    }
    this.isEditing = !this.isEditing;  // Cambiar el estado de edición
  }

  saveChanges(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      const updatedUser = { ...this.user };
      if (updatedUser.hasOwnProperty('password')) {
        delete updatedUser.password;
      }
  
      // Agregamos los descuentos al usuario antes de enviarlo
      updatedUser.descuentos = this.descuentos.reduce((acc, curr) => {
        acc[curr.rubro] = curr.porcentaje;
        return acc;
      }, {} as { [key: string]: number });
      
  
      this.authService.updateUserById(userId, updatedUser).subscribe({
        next: () => {
          this.authService.updateUserDiscounts(userId, this.descuentos).subscribe({
            next: () => {
              console.log('Usuario y descuentos actualizados');
              this.isEditing = false;
              this.userBackup = { ...this.user };
            },
            error: (err) => {
              console.error('Error al guardar los descuentos:', err);
            }
          });
        },
        error: (err) => {
          console.error('Error al guardar el usuario:', err);
        }
      });
    }
  }  
}
