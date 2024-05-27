const connection = require('../config/database');

// Créer un nouveau produit
exports.createProduct = (req, res) => {
  const { name, description, price, stock } = req.body;
  const imageURL = req.file ? `/${req.file.originalname}` : null; // Chemin de l'image téléchargée
  const query = 'INSERT INTO produit (name, description, price, stock, imageURL) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, price, stock, imageURL], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, name, description, price, stock, imageURL });
  });
};

// Obtenir tous les produit
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
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;

  // Fetch the current image URL from the database
  const getCurrentImageURLQuery = 'SELECT imageURL FROM produit WHERE id = ?';
  connection.query(getCurrentImageURLQuery, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const currentImageURL = results[0].imageURL;

    let imageURL = currentImageURL; // Default to current image URL
    if (req.file) {
      imageURL = `/${req.file.originalname}`; // Use new image URL if provided
    }

    const query = 'UPDATE produit SET name = ?, description = ?, price = ?, stock = ?, imageURL = ? WHERE id = ?';
    const params = [name, description, price, stock, imageURL, id];

    connection.query(query, params, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ id, name, description, price, stock, imageURL });
    });
  });
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
