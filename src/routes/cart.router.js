const { Router } = require('express');
const ProductManager = require('../dao/dbManagers/productsManager');
const CartManager = require('../dao/dbManagers/cartManager');
const CartModel = require('../dao/models/cart.model');

// Creación de instancias de ProductManager y CartManager
const cartManager = new CartManager(__dirname + '/../files/listaCarrito.json');
const productManager = new ProductManager(__dirname + '/../files/listaProductos.json');

// Creación del router
const router = Router();

// Ruta POST: '/api/carts/'
router.post('/', async (req, res) => {
    try {
        await cartManager.addCart();
        res.send({ status: 'success' });

    } catch (error) {
        console.error("Error al agregar el carrito ", error);
        res.status(500).send("Error del servidor");
    }
});

// Ruta GET: '/api/carts/:cid'
router.get('/:cid', async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await cartManager.getCart(id);

        res.send(cart);
    } catch (error) {
        res.status(404).send({ error: `No existe el id seleccionado ${id}`});
    }
});

// Ruta GET: '/api/carts/'
router.get('/', async (req, res) => {
    try {
        const cart = await cartManager.getAllCarts();
        res.send(cart);
    } catch (error) {
        res.status(404).send({ error: 'No se pudo encontrar el carrito'});
    }
});

// Ruta POST: '/api/carts/:cid/product/:pid'
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const cart = await cartManager.getCart(cartId);
        const product = await productManager.getProductById(productId);

        if (product) {
            await cartManager.addProduct(cartId, productId);
            res.send({ status: 'success' });
        } else {
            res.status(404).send({ error: `El producto con el ID ${productId} no encontrado` });
        }
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error);
        res.status(500).send("Error del Server");
    }
});

// Ruta DELETE: '/api/carts/:cid/products/:pid'
router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        await cartManager.deleteProductFromCart(cartId, productId);

        res.send({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta PUT: '/api/carts/:cid'
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const productList = req.body;
    
    if (productList) {
        const updatedProducts = await cartManager.updateCart(cartId, productList);
        res.send({ status: 'success', updatedProducts});
    } else {
        res.status(404).send({ error: `Carrito con la ID ${cartId} no encontrado para actualizar` });
    }
});

// Ruta PUT: '/api/carts/:cid/products/:pid'
router.put('/:cid/products/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newProductQuantity = req.body.quantity;

    if (newProductQuantity) {
        const updatedQuantity = await cartManager.updateQuantity(cartId, productId, newProductQuantity)
        res.send({ status: 'success', updatedQuantity});
    } else {
        res.status(404).send({ error: `Hubo un error al actualizar la cantidad del producto seleccionado` });
    }
});

// Ruta DELETE: '/api/carts/:cid/'
router.delete('/:cid/', async (req, res) => {
    try {
        const cartId = req.params.cid;

        await cartManager.deleteAllProducts(cartId);
        res.send({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;