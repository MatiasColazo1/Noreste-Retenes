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
    Precio: Number,
    Imagen: {
        type: String,
        default: 'https://res.cloudinary.com/dlish6q5r/image/upload/v1743873476/no-imagen_jyqyup.png'
      }
},
    { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
