const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/product.controller');
const checkToken = require('../middleware/checkAdminToken');

// Multer configuration to store files in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB for files
      fieldSize: 10 * 1024 * 1024 // 10 MB for non-file multipart form fields
  }
});

// Créer un nouveau produit
router.post('/', checkToken, upload.single('image'), productController.createProduct);

// Obtenir tous les produits
router.get('/', productController.getProducts);

// Obtenir un produit par ID
router.get('/:id', productController.getProductById);

// Mettre à jour un produit par ID
router.put('/:id', checkToken, upload.single('image'), productController.updateProduct);

// Supprimer un produit par ID
router.delete('/:id', checkToken, productController.deleteProduct);

module.exports = router;
