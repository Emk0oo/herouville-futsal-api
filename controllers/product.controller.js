const connection = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

// Créer un nouveau produit
exports.createProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  let imageBase64 = null;

  try {
    if (req.file) {
      const imageBuffer = req.file.buffer;
      console.log(`Image buffer size: ${imageBuffer.length} bytes`);
      imageBase64 = imageBuffer.toString('base64');
      console.log(`Base64 length: ${imageBase64.length} characters`);
    }

    const query = 'INSERT INTO produit (name, description, price, stock, imageBase64) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [name, description, price, stock, imageBase64], (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: results.insertId, name, description, price, stock, imageBase64 });
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Obtenir tous les produits
exports.getProducts = (req, res) => {
  const query = 'SELECT * FROM produit';
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

// Obtenir un produit par ID
exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM produit WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(results[0]);
  });
};

// Mettre à jour un produit par ID
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  try {
    const getCurrentImageBase64Query = 'SELECT imageBase64 FROM produit WHERE id = ?';
    const [currentImageResult] = await connection.promise().query(getCurrentImageBase64Query, [id]);
    if (currentImageResult.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let imageBase64 = currentImageResult[0].imageBase64;

    if (req.file) {
      const imageBuffer = req.file.buffer;
      imageBase64 = imageBuffer.toString('base64');
    }

    const query = 'UPDATE produit SET name = ?, description = ?, price = ?, stock = ?, imageBase64 = ? WHERE id = ?';
    const params = [name, description, price, stock, imageBase64, id];

    connection.query(query, params, (err, results) => {
      if (err) {
        console.error("Database query error:", err.message);
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ id, name, description, price, stock, imageBase64 });
    });
  } catch (error) {
    console.error("Error processing request:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// Supprimer un produit par ID
exports.deleteProduct = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM produit WHERE id = ?';
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  });
};
