const carritoDao = require('../daos/carrito.daos');

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

        await carritoDao.addToCart(userId, { idProducto, codigo, cantidad });
        res.json({ message: 'Producto agregado al carrito' });
    } catch (err) {
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
