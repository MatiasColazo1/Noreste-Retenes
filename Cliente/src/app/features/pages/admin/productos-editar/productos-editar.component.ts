import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-productos-editar',
  templateUrl: './productos-editar.component.html',
  styleUrls: ['./productos-editar.component.css']
})
export class ProductosEditarComponent implements OnInit {
  producto: any;
  selectedFile!: File;
  timestamp = Date.now();
  modoEdicion = false;

  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.loadProducto();
  }

  loadProducto() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(p => {
        this.producto = p;
      });
    }
  }

  onImagenSeleccionada(file: File) {
    this.selectedFile = file;
  }

  uploadProductImage() {
    if (!this.selectedFile || !this.producto) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('upload_preset', 'mi_present');
    formData.append('folder', 'productos');
  
    fetch('https://api.cloudinary.com/v1_1/dlish6q5r/image/upload', {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        const imageUrl = data.secure_url;
  
        this.productService.updateProductImage(this.producto._id, imageUrl).subscribe({
          next: (updatedProduct) => {
            alert('✅ Imagen actualizada correctamente');
            this.producto.Imagen = updatedProduct.product.Imagen;
            this.timestamp = Date.now();
          },
          error: (err) => {
            console.error('Error al actualizar imagen:', err);
            alert('❌ Error al actualizar imagen');
          }
        });
      });
  }

  toggleModoEdicion() {
    this.modoEdicion = !this.modoEdicion;
  }

  onMedidasChange(event: any) {
    if (!this.producto) return;
    this.producto = { ...this.producto, ...event };
  }

  onIdentificadorChange(event: any) {
    if (!this.producto) return;
    this.producto = { ...this.producto, ...event };
  }

  onDescripcionChange(event: string) {
    if (!this.producto) return;
    this.producto.Descripcion = event;
  }

  onDatosGeneralesChange(event: any) {
    if (!this.producto) return;
    this.producto = { ...this.producto, ...event };
  }

  onMarcaChange(event: string) {
    if (!this.producto) return;
    this.producto.MARCA = event;
  }

  onEquivalenciasChange(event: string[]) {
    if (!this.producto) return;
    this.producto.equivalencias = event;
  }

  actualizarProducto() {
    if (!this.producto) return;
    
    this.productService.updateProductById(this.producto._id, this.producto).subscribe({
      next: (response: any) => {
        alert('✅ Producto actualizado correctamente');
        this.modoEdicion = false;
        this.loadProducto();
      },
      error: (error: any) => {
        console.error('Error al actualizar el producto:', error);
        alert('❌ Error al actualizar el producto');
      }
    });
  }

  eliminarProducto() {
    if (!this.producto || !this.producto._id) return;

    const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${this.producto.Nombre}"? Esta acción no se puede deshacer.`);

    if (confirmacion) {
      this.productService.deleteProduct(this.producto._id).subscribe({
        next: (res) => {
          alert('✅ Producto eliminado correctamente');
          this.router.navigate(['/catalogo']);
        },
        error: (err) => {
          console.error('Error al eliminar producto:', err);
          alert('❌ Hubo un error al eliminar el producto');
        }
      });
    }
  }
}
