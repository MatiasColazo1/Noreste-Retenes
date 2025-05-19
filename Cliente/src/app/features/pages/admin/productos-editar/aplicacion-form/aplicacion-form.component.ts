import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AplicacionService } from 'src/app/services/aplicacion.service';
import { Aplicacion } from 'src/app/models/aplicacion';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-aplicacion-form',
  templateUrl: './aplicacion-form.component.html',
  styleUrls: ['./aplicacion-form.component.css']
})
export class AplicacionFormComponent implements OnChanges {
  @Input() productoId!: string;

  aplicaciones: Aplicacion[] = [];
  nuevaAplicacion: Aplicacion = this.initAplicacion();
  token: string = localStorage.getItem('token') || '';
  editandoId: string | null = null;

  constructor(private aplicacionService: AplicacionService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productoId'] && this.productoId) {
      this.nuevaAplicacion.producto = this.productoId;
      this.cargarAplicaciones();
    }
  }

  initAplicacion(): Aplicacion {
    return {
      producto: this.productoId || '', // previene error si se llama antes
      marcaVehiculo: '',
      modeloVehiculo: '',
      descripcion: '',
      observacion: ''
    };
  }

  cargarAplicaciones() {
    if (!this.productoId) return; // protección adicional
    this.aplicacionService.getAplicacionesByProducto(this.productoId, this.token)
      .subscribe({
        next: (data) => this.aplicaciones = data,
        error: (err) => console.error('Error cargando aplicaciones', err)
      });
  }
  guardarAplicacion() {
    if (this.editandoId) {
      this.aplicacionService.updateAplicacion(this.editandoId, this.nuevaAplicacion, this.token)
        .subscribe({
          next: () => {
            this.cancelarEdicion();
            this.cargarAplicaciones();
          },
          error: (err) => console.error('Error actualizando', err)
        });
    } else {
      this.aplicacionService.createAplicacion(this.nuevaAplicacion, this.token)
        .subscribe({
          next: () => {
            this.nuevaAplicacion = this.initAplicacion();
            this.cargarAplicaciones();
          },
          error: (err) => console.error('Error creando', err)
        });
    }
  }

  editarAplicacion(aplicacion: Aplicacion) {
    this.nuevaAplicacion = { ...aplicacion };
    this.editandoId = aplicacion._id || null;
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nuevaAplicacion = this.initAplicacion();
  }

  eliminarAplicacion(id: string) {
    if (confirm('¿Estás seguro de eliminar esta aplicación?')) {
      this.aplicacionService.deleteAplicacion(id, this.token)
        .subscribe({
          next: () => this.cargarAplicaciones(),
          error: (err) => console.error('Error eliminando', err)
        });
    }
  }
}