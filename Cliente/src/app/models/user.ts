export interface User {
  _id?: string; 
    nombre: string;
    apellido: string;
    tipoCliente: 'Mayorista' | 'Minorista';
    fechaNacimiento: string;
    cuit: string;
    direccion: string;
    domicilioEntrega: string;
    celular: string;
    ciudad: string;
    email: string;
    password?: string;
    sitioWeb?: string;
    telefono?: string;
    situacionIVA?: string;
    estadoCivil?: string;
    numero?: string;
    listaPrecio?: string;
    transporte?: string;
    asociadoVendedor?: string;
    barrio?: string;
    rutaVenta?: string;
    comentario?: string;
    role?: 'user' | 'admin';
  }