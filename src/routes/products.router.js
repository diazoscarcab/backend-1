const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager();

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) return res.json(product);
  res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const { title, description, code, price, status, stock, category, thumbnails } = req.body;

  if (!title || !description || !code || price == null || stock == null || !category || !Array.isArray(thumbnails)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o son inválidos' });
  }

  const newProduct = await productManager.addProduct({ title, description, code, price, status, stock, category, thumbnails });
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  if (updated) return res.json(updated);
  res.status(404).json({ error: 'Producto no encontrado' });
});

router.delete('/:pid', async (req, res) => {
  const deleted = await productManager.deleteProduct(req.params.pid);
  if (deleted) return res.json({ message: 'Producto eliminado' });
  res.status(404).json({ error: 'Producto no encontrado' });
});

module.exports = router;