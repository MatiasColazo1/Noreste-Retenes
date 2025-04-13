const Product = require('../models/products.model');

class ProductDAO {
// Obtener productos con paginación y cache en Redis
static async getProducts(redisClient, page = 1, limit = 20) {
  const cacheKey = `products:page:${page}:limit:${limit}`;

  try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
          return JSON.parse(cachedData);
      }

      // Mejorar paginación con base en _id
      const products = await Product.find()
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(); // Reduce el tiempo de respuesta
      
      await redisClient.setEx(cacheKey, 600, JSON.stringify(products));

      return products;
  } catch (error) {
      console.error('❌ Error al obtener productos:', error);
      throw error;
  }
}




// Insertar, actualizar y eliminar productos según el nuevo Excel
static async syncProducts(productsFromExcel, redisClient) {
    try {
        const bulkOps = [];
        const cacheUpdates = {};
        
        // Crear operaciones de bulkWrite y actualizar caché en Redis
        productsFromExcel.forEach(product => {
            const identifier = `${product.Prefijo}-${product.Codigo}-${product.MARCA}-${product.NombreRubro}`;

            bulkOps.push({
                updateOne: {
                    filter: { Prefijo: product.Prefijo, Codigo: product.Codigo, MARCA: product.MARCA, NombreRubro: product.NombreRubro },
                    update: { $set: product },
                    upsert: true
                }
            });

            cacheUpdates[identifier] = product;
        });

        if (bulkOps.length > 0) {
            await Product.bulkWrite(bulkOps);
        }

        // Guardar los productos en Redis de forma más eficiente (en lotes)
        for (const [key, value] of Object.entries(cacheUpdates)) {
            await redisClient.setEx(`product:${key}`, 600, JSON.stringify(value));
        }

        return { message: "Productos sincronizados correctamente" };
    } catch (error) {
        console.error('❌ Error en syncProducts:', error);
        throw error;
    }
}

// Obtener producto por ID
static async getProductById(id) {
    try {
        const product = await Product.findById(id).lean();
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        return product;
    } catch (error) {
        console.error('❌ Error al obtener el producto por ID:', error);
        throw error;
    }
}

// Actualizar precios desde otro Excel
static async syncPrices(pricesFromExcel) {
    try {
      // Poner todos los precios en null antes de cargar los nuevos
      await Product.updateMany({}, {
        $set: {
          PrecioLista1: null,
          PrecioLista2: null
        }
      });
  
      const bulkOps = [];
  
      pricesFromExcel.forEach(item => {
        const filter = {
          Prefijo: item.PREF,
          Codigo: item.CODIGO,
          MARCA: item.MARCA,
          NombreRubro: item.RUBRO
        };
  
        const update = {
          $set: {
            PrecioLista1: item.PrecioLista1 || null,
            PrecioLista2: item.PrecioLista2 || null
          }
        };
  
        bulkOps.push({
          updateOne: {
            filter,
            update
          }
        });
      });
  
      if (bulkOps.length > 0) {
        await Product.bulkWrite(bulkOps);
      }
  
      return { message: "Precios actualizados correctamente" };
    } catch (error) {
      console.error("❌ Error al actualizar precios:", error);
      throw error;
    }
  }
  

static async updateImage(id, ImagenUrl) {
    try {
        const updated = await Product.findByIdAndUpdate(id, { ImagenUrl }, { new: true }).lean();
        return updated;
    } catch (error) {
        console.error('❌ Error al actualizar imagen del producto:', error);
        throw error;
    }
}

static async getProductsByUser(userListaPrecio, redisClient, page = 1, limit = 20) {
  const cacheKey = `products:user:${userListaPrecio}:page:${page}:limit:${limit}`;

  try {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // 🔸 Determinar qué campo de precio incluir
    const priceField = userListaPrecio === 'Lista 2' ? 'PrecioLista2' : 'PrecioLista1';

    // 🔸 Proyección: solo campos necesarios
    const projection = {
      Nombre: 1,
      Codigo: 1,
      MARCA: 1,
      NombreRubro: 1,
      Imagen: 1,
      [priceField]: 1,
    };

    const products = await Product.find({}, projection)
      .sort({ _id: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 🔸 Renombrar el campo de precio
    const productsWithUserPrice = products.map(prod => ({
      ...prod,
      Precio: prod[priceField],
    }));

    await redisClient.setEx(cacheKey, 600, JSON.stringify(productsWithUserPrice));

    return productsWithUserPrice;
  } catch (error) {
    console.error('❌ Error al obtener productos según la lista de precios:', error);
    throw error;
  }
}

// Buscar productos cuyo código contenga el valor ingresado (parcial)
static async getProductsByCodigoParcial(codigo, skip = 0, limit = 20) {
  try {
    const regex = new RegExp(codigo, 'i');
    const filter = codigo ? { Codigo: { $regex: regex } } : {};

    const products = await Product.find(filter).skip(skip).limit(limit).lean();
    const total = await Product.countDocuments(filter);

    return { products, total };
  } catch (error) {
    console.error('❌ Error en getProductsByCodigoParcial:', error);
    throw error;
  }
}




}


module.exports = ProductDAO;
