const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productController = require('../controllers/product.controller');
const checkToken = require('../middleware/checkAdminToken');

// Configuration de Multer pour stocker les images dans le dossier public
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Conserve le nom original du fichier
  }
});

const upload = multer({ storage: storage });

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
