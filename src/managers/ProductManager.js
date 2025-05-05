require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');

const productsFilePath = path.resolve(process.env.PRODUCTS_FILE);

class ProductManager {
  constructor() {
    this.path = productsFilePath;
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

  async getProducts() {
    return await this._readFile();
  }

  async getProductById(id) {
    const products = await this._readFile();
    return products.find(p => String(p.id) === String(id));
  }

  async addProduct(product) {
    const products = await this._readFile();
    const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id))) + 1 : 1;
    const newProduct = { id: newId, ...product };
    products.push(newProduct);
    await this._writeFile(products);
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this._readFile();
    const index = products.findIndex(p => String(p.id) === String(id));
    if (index === -1) return null;

    // Evitar que se actualice el ID
    updates.id && delete updates.id;

    products[index] = { ...products[index], ...updates };
    await this._writeFile(products);
    return products[index];
  }

  async deleteProduct(id) {
    const products = await this._readFile();
    const newProducts = products.filter(p => String(p.id) !== String(id));
    await this._writeFile(newProducts);
    return products.length !== newProducts.length;
  }
}

module.exports = ProductManager;