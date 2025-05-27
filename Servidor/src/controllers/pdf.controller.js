const PDFDocument = require('pdfkit');
const User = require('../models/user.model');
const Product = require('../models/products.model');
const mongoose = require('mongoose');
const redisClient = require('../config/db').redisClient; // Asegúrate de importar correctamente
const transporter = require('../config/mailer');

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
      console.log('⛔ ID inválido detectado en el backend:', userId);
      return res.status(400).json({ error: 'ID de usuario inválido' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const key = `cart:${userId}`;
    const carritoData = await redisClient.v4.get(key);

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


    // ----- Encabezado -----
    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`, 30, 30);
    doc.text(`N°: 0004-00000000`, 400, 30);

    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Sr.(s): ${user.nombre} ${user.apellido}`, 30, 60);
    doc.font('Helvetica').text(`Domicilio: ${user.direccion}`, 30, 75);
    doc.text(`Localidad: ${user.ciudad}`, 300, 75);
    doc.text(`CUIT: ${user.cuit}`, 300, 90);
    doc.text(`IVA: ${user.situacionIVA}`, 30, 90);
    doc.text(`Transporte: ${user.transporte}`, 30, 105);

    // Línea separadora
    doc.moveTo(30, 120).lineTo(570, 120).stroke();

    // ----- Encabezado de tabla -----
    doc.font('Helvetica-Bold').text('Cant.', 30, 130);
    doc.text('Cod.', 70, 130);
    doc.text('Descripción', 120, 130);
    doc.text('Precio', 300, 130);
    doc.text('% Dto.', 390, 130);
    doc.text('Final', 450, 130);
    doc.text('Subtotal', 510, 130);

    doc.moveTo(30, 145).lineTo(570, 145).stroke();
    doc.font('Helvetica');

    let y = 155;
    let totalGeneral = 0;

    // ----- Cuerpo de tabla -----
    itemsProcesados.forEach(item => {
      totalGeneral += item.subtotal;

      doc.text(`${item.cantidad}`, 30, y);
      doc.text(`${item.Codigo}`, 70, y);
      doc.text(`${item.Descripcion}`, 120, y, { width: 160 });
      doc.text(`$${item.precioOriginal.toFixed(2)}`, 300, y, { width: 80, align: 'right' });
      doc.text(`${item.descuento}%`, 390, y, { width: 50, align: 'right' });
      doc.text(`$${item.precioFinal.toFixed(2)}`, 450, y, { width: 60, align: 'right' });
      doc.text(`$${item.subtotal.toFixed(2)}`, 510, y, { width: 60, align: 'right' });

      y += 20;
    });

    // Línea final
    doc.moveTo(30, y).lineTo(570, y).stroke();
    y += 10;

    // ----- Total general -----
    doc.font('Helvetica-Bold').text('TOTAL:', 400, y);
    doc.text(`$${totalGeneral.toFixed(2)}`, 510, y, { align: 'right' });

    y += 25;

    // ----- Observaciones -----
    doc.font('Helvetica').fontSize(10).text('Obs.: PRECIOS NETOS MÁS I.V.A. --- IMPORTE FINAL EXPRESADO EN PESOS ARGENTINOS.', 30, y);

    // Guardar fecha de última compra
    user.ultimaCompra = new Date();
    await user.save();

    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);
    
      // Enviar como respuesta al navegador
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename=carrito.pdf');
      res.send(pdfData);
    
      // Enviar al email del admin
      try {
        await transporter.sendMail({
          from: '"Mi App" <tucorreo@gmail.com>',
          to: 'mati.colazo97@gmail.com', // <-- Cambia esto al correo real del admin
          subject: `Nuevo pedido de ${user.nombre} ${user.apellido}`,
          text: 'Adjunto PDF con el carrito del cliente.',
          attachments: [
            {
              filename: 'carrito.pdf',
              content: pdfData,
            },
          ],
        });
        console.log('✅ PDF enviado por email al admin');
      } catch (mailError) {
        console.error('❌ Error al enviar email al admin:', mailError);
      }
    });

    doc.end();

  } catch (error) {
    console.error('Error generando PDF:', error);
    res.status(500).json({ error: 'Error interno al generar el PDF' });
  }
};
