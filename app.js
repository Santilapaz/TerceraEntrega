const express = require('express');
const app = express();
const router = require('./src/routes/cart.router');

app.use('/api/carts', router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
