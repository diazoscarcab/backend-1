require('dotenv').config();
const express = require('express');
const app = express();

const productRoutes = require('./routes/products.router');
const cartRoutes = require('./routes/carts.router');

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});