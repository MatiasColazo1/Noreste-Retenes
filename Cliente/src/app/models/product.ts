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
  PrecioLista1?: number; // 💵 Agregá esto
  PrecioLista2?: number; // 💵 Y esto también
}
