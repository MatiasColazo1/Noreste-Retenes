import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-productos-editar',
  templateUrl: './productos-editar.component.html',
  styleUrls: ['./productos-editar.component.css']
})
export class ProductosEditarComponent implements OnInit {

  producto: any; // Asegúrate de tener esto definido
  selectedFile!: File;
  timestamp = Date.now(); // para forzar recarga de imagen
  constructor(private productService: ProductService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(p => {
        this.producto = p;
      });
    } else {
      console.error('ID no encontrado en la ruta');
    }

    this.loadProducto();
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
            this.timestamp = Date.now(); // fuerza recarga de imagen
          },
          error: (err) => {
            console.error('Error al actualizar imagen:', err);
            alert('❌ Error al actualizar imagen');
          }
        });
      });
  }
  

  loadProducto() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe(p => {
        this.producto = p;
      });
    }
  }
  
  eliminarProducto() {
  if (!this.producto || !this.producto._id) return;

  const confirmacion = confirm(`¿Estás seguro de eliminar el producto "${this.producto.Nombre}"? Esta acción no se puede deshacer.`);

  if (confirmacion) {
    this.productService.deleteProduct(this.producto._id).subscribe({
      next: (res) => {
        alert('✅ Producto eliminado correctamente');
        // Redirigir o recargar según necesites, por ejemplo:
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
