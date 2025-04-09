import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  product!: Product; // Propiedad para almacenar el producto

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    this.obtenerProducto();
  }

  obtenerProducto() {
    const id = this.route.snapshot.paramMap.get('id'); // Obtener ID desde la URL
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (data) => (this.product = data),
        error: (err) => console.error('❌ Error al obtener el producto:', err),
      });
    }
  }
}