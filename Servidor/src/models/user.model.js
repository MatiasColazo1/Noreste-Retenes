const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: { type: String, required: true, trim: true },
    apellido: { type: String, required: true, trim: true },
    tipoCliente: { 
        type: String, 
        enum: ['Mayorista', 'Minorista'], 
        required: true 
    },
    fechaNacimiento: { type: Date, required: true },
    cuit: { type: String, required: true, unique: true },
    direccion: { type: String, required: true },
    domicilioEntrega: { type: String, required: true },
    celular: { type: String, required: true },
    ciudad: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    // Datos opcionales
    sitioWeb: { type: String, default: '' },
    telefono: { type: String, default: '' },
    situacionIVA: { 
        type: String, 
        enum: [
            'Responsable Inscripto', 
            'Monotributista', 
            'Exento', 
            'Consumidor Final', 
            'No Responsable', 
            'Sujeto No Categorizado'
        ], 
        required: true 
    },
    estadoCivil: { type: String, default: '' },

    // Datos solo editables por el administrador
    numero: { type: String, default: '' },
    listaPrecio: { 
        type: String, 
        enum: ['Lista 1', 'Lista 2'],  // Lista de opciones permitidas
        default: 'Lista 1',            // Valor predeterminado
        required: true                 // Requiere que no esté vacío
    },
    transporte: { type: String, default: '' },
    asociadoVendedor: { type: String, default: '' },
    barrio: { type: String, default: '' },
    rutaVenta: { type: String, default: '' },
    comentario: { type: String, default: '' },

    // Rol del usuario (por defecto es "user")
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    }
}, { 
    timestamps: true // Agrega `createdAt` y `updatedAt` automáticamente
});

module.exports = mongoose.model('User', UserSchema);