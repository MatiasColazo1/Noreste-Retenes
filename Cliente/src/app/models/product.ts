import { Aplicacion } from './aplicacion'; // asegurate de importar la interfaz

export interface Product {
  _id: string;
  Prefijo: string;
  Codigo: string;
  SubFijo: string;
  MARCA: string;
  NombreRubro: string;
  NombreSubRubro: string;
  INTERIOR: number;
  EXTERIOR: number;
  ANCHO: number;
  Nombre: string;
  Observacion: string;
  Precio?: number;
  Imagen: string;
  PrecioLista1?: number;
  PrecioLista2?: number;
  precioOriginal?: number;
  precioFinal?: number;
  descuentoAplicado?: number;
  equivalencias: string[];

  // 🔽 Agregado para reflejar la relación virtual de Mongoose
  aplicaciones?: Aplicacion[];
}
