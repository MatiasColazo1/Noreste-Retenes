import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-imagen-uploader',
  templateUrl: './imagen-uploader.component.html',
  styleUrls: ['./imagen-uploader.component.css']
})
export class ImagenUploaderComponent {
  @Input() imagenUrl!: string;
  @Input() isAdmin = false;
  @Output() imagenSeleccionada = new EventEmitter<File>();
  @Output() imagenSubida = new EventEmitter<void>();

  timestamp = Date.now();

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada.emit(file);
    }
  }

  onImageError(event: Event) {
    const target = event.target as HTMLImageElement;
    target.src = 'https://res.cloudinary.com/dlish6q5r/image/upload/v1747076097/download_vbzenr.jpg';
  }

  subirImagen() {
    this.imagenSubida.emit();
    this.timestamp = Date.now(); // actualizar para evitar caché
  }
}