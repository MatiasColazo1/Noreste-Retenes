const PDFDocument = require('pdfkit');
const User = require('../models/user.model');
const Product = require('../models/products.model');
const mongoose = require('mongoose'); 
const redisClient = require('../config/db').redisClient; // Asegúrate de importar correctamente

function calcularDescuento(descuentosUsuario, rubroProducto) {
  const descuento = descuentosUsuario.find(d => d.rubro === rubroProducto);
  return descuento ? descuento.porcentaje : 0;
}

function getPrecioOriginal(producto, listaPrecio) {
  if (listaPrecio === 'Lista 1') return producto.PrecioLista1 || 0;
  if (listaPrecio === 'Lista 2') return producto.PrecioLista2 || 0;
  return 0;
}

exports.generarPDFCarrito = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const key = `cart:${userId}`;

    // Asegúrate de usar la nueva sintaxis de Redis v4
    const carritoData = await redisClient.v4.get(key); // Aquí es donde usamos redisClient.v4.get

    if (!carritoData) {
      return res.status(404).json({ error: 'Carrito no encontrado en Redis' });
    }

    const carrito = JSON.parse(carritoData); 
    const productIds = carrito.map(item => item.idProducto);
    const productos = await Product.find({ _id: { $in: productIds } });

    const itemsProcesados = carrito.map(item => {
      const producto = productos.find(p => p._id.toString() === item.idProducto);
      if (!producto) return null;

      const precioOriginal = getPrecioOriginal(producto, user.listaPrecio);
      const descuento = calcularDescuento(user.descuentos, producto.NombreRubro);
      const precioFinal = precioOriginal * (1 - descuento / 100);
      const subtotal = precioFinal * item.cantidad;

      return {
        Codigo: producto.Codigo,
        Descripcion: producto.Nombre,
        precioOriginal,
        descuento,
        precioFinal,
        cantidad: item.cantidad,
        subtotal
      };
    }).filter(Boolean);

    const doc = new PDFDocument({ margin: 30 });
    let buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfData = Buffer.concat(buffers);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=carrito.pdf');
      res.send(pdfData);
    });

    doc.fontSize(16).text('Carrito de compras', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.text(`Cliente: ${user.nombre} ${user.apellido}`);
    doc.text(`Dirección: ${user.direccion}`);
    doc.text(`Ciudad: ${user.ciudad}`);
    doc.text(`Celular: ${user.celular}`);
    doc.text(`CUIT: ${user.cuit}`);
    doc.text(`IVA: ${user.situacionIVA}`);
    doc.text(`Transporte: ${user.transporte}`);
    doc.moveDown();

    doc.fontSize(10);
    doc.text('Código | Descripción | Cantidad | Precio Original | Descuento % | Precio Final | Subtotal');
    doc.moveDown();

    let totalGeneral = 0;

    itemsProcesados.forEach(item => {
      totalGeneral += item.subtotal;

      doc.text(
        `${item.Codigo} | ${item.Descripcion} | ${item.cantidad} | $${item.precioOriginal.toFixed(2)} | ${item.descuento}% | $${item.precioFinal.toFixed(2)} | $${item.subtotal.toFixed(2)}`
      );
    });

    doc.moveDown();
    doc.fontSize(12).text(`TOTAL: $${totalGeneral.toFixed(2)}`, { align: 'right' });

    doc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error interno al generar el PDF' });
  }
};
