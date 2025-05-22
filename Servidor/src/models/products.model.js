const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  Prefijo: String,
  Codigo: String,
  SubFijo: String,
  MARCA: String,
  NombreRubro: String,
  NombreSubRubro: String,
  INTERIOR: Number,
  EXTERIOR: Number,
  ANCHO: Number,
  Nombre: String,
  Observacion: String,
  PrecioLista1: Number,
  PrecioLista2: Number,
  Imagen: {
    type: String,
    default: 'https://res.cloudinary.com/dlish6q5r/image/upload/v1743873476/no-imagen_jyqyup.png'
  },
  equivalencias: [String]
}, { timestamps: true });

// Índice compuesto para identificación única
ProductSchema.index({ Prefijo: 1, Codigo: 1, MARCA: 1 }, { unique: true });

// Relación virtual para que se puedan consultar las aplicaciones desde el producto
ProductSchema.virtual('aplicaciones', {
  ref: 'Aplicacion',                // El modelo referenciado
  localField: '_id',                // El campo local en Product
  foreignField: 'producto',         // El campo en Aplicacion que referencia a Product
});

// Para que Mongoose incluya los virtuals al hacer `.toJSON()` o `.toObject()`
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
