const mongoose = require('mongoose');

const AplicacionSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  marcaVehiculo: { type: String, required: true },
  modeloVehiculo: { type: String, required: true },
  descripcion: { type: String },
  observacion: { type: String }
}, { timestamps: true });

const Aplicacion = mongoose.model('Aplicacion', AplicacionSchema);

module.exports = Aplicacion;
