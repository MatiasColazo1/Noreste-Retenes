const { redisClient } = require('../config/db');
const TTL_HOURS = 48;

function getCartKey(userId) {
    return `cart:${userId}`;
}

// Obtener carrito
async function getCart(userId) {
    const key = getCartKey(userId);

    try {
        const data = await redisClient.v4.get(key);
        return data ? JSON.parse(data) : [];
    } catch (err) {
        console.error('❌ Error al obtener datos de Redis:', err);
        return [];
    }
}

// Guardar carrito (con expiración de 48 horas)
async function saveCart(userId, cartItems) {
    const key = getCartKey(userId);
    const ttlSeconds = TTL_HOURS * 60 * 60;

    try {
        await redisClient.v4.set(key, JSON.stringify(cartItems), {
            EX: ttlSeconds,
        });
    } catch (err) {
        console.error('❌ Error al guardar en Redis:', err);
    }
}

// Agregar producto al carrito
async function addToCart(userId, newItem) {
    const cart = await getCart(userId);
    const index = cart.findIndex(p => p.idProducto === newItem.idProducto);

    if (index !== -1) {
        cart[index].cantidad += newItem.cantidad;
    } else {
        cart.push(newItem);
    }

    await saveCart(userId, cart);
}

// Eliminar producto
async function removeFromCart(userId, productId) {
    const cart = await getCart(userId);
    const updated = cart.filter(p => p.idProducto !== productId);
    await saveCart(userId, updated);
}

// Vaciar carrito
async function clearCart(userId) {
    await redisClient.v4.del(getCartKey(userId));
}

module.exports = {
    getCart,
    saveCart,
    addToCart,
    removeFromCart,
    clearCart
};
