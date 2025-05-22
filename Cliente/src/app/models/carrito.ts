export interface Carrito {
    idProducto: string;
    codigo: string;
    cantidad: number;
    precioOriginal: number;
    precioFinal: number; 
    marca: string;
    rubro?: string;
  }
