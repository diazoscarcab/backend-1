require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const cartsFilePath = path.resolve(process.env.CARTS_FILE);

class CartManager {
  constructor() {
    this.path = cartsFilePath;
  }

  async _readFile() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data || '[]');
    } catch (error) {
      return [];
    }
  }

  async _writeFile(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._readFile();
    const newId = carts.length > 0 ? Math.max(...carts.map(c => parseInt(c.id))) + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._writeFile(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._readFile();
    return carts.find(c => String(c.id) === String(id));
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._readFile();
    const cart = carts.find(c => String(c.id) === String(cartId));
    if (!cart) return null;

    const existingProduct = cart.products.find(p => String(p.product) === String(productId));
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await this._writeFile(carts);
    return cart;
  }
}

module.exports = CartManager;