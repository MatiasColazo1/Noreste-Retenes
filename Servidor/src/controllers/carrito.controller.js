const carritoDao = require('../daos/carrito.daos');
const Product = require('../models/products.model');
const User = require('../models/user.model');

// Obtener el carrito
const getCart = async (req, res) => {
    try {
        const userId = String(req.user._id);
        const cart = await carritoDao.getCart(userId);
        res.json(cart);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: err.message });
    }
};

// Agregar producto al carrito
const addToCart = async (req, res) => {
    try {
        const userId = String(req.user._id);
        const { idProducto, codigo, cantidad } = req.body;

        if (!idProducto || !codigo || !cantidad || cantidad <= 0) {
            return res.status(400).json({ message: 'Datos inválidos para agregar al carrito' });
        }

        // Obtener producto
        const producto = await Product.findById(idProducto);
        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Obtener usuario completo (por si `req.user` no incluye todos los campos)
        const usuario = await User.findById(userId);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Determinar lista de precios
        const listaPrecio = usuario.listaPrecio === 'Lista 2' ? producto.PrecioLista2 : producto.PrecioLista1;

        // Obtener descuento del rubro si existe
        const descuento = usuario.descuentos.find(d => d.rubro === producto.NombreRubro);
        const porcentajeDescuento = descuento ? descuento.porcentaje : 0;

        const precioConDescuento = listaPrecio * (1 - porcentajeDescuento / 100);

        // Agregar al carrito
        const newItem = {
            idProducto,
            codigo,
            cantidad,
            marca: producto.MARCA,
            precioUnitario: listaPrecio,
            precioFinal: precioConDescuento,
        };

        await carritoDao.addToCart(userId, newItem);

        res.json({ message: 'Producto agregado al carrito' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al agregar al carrito', error: err.message });
    }
};


// Eliminar producto del carrito
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const { idProducto } = req.params;

        await carritoDao.removeFromCart(userId, idProducto);
        res.json({ message: 'Producto eliminado del carrito' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: err.message });
    }
};

// Vaciar carrito
const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;
        await carritoDao.clearCart(userId);
        res.json({ message: 'Carrito vaciado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al vaciar el carrito', error: err.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart,
    clearCart
};
