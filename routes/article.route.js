const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const articleController = require('../controllers/article.controller');
const checkToken  = require('../middleware/checkAdminToken');

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

// Create a new article
router.post('/', checkToken, upload.single('image'), articleController.createArticle);

// Get all articles
router.get('/', articleController.getArticles);

// Get a single article by ID
router.get('/:id', articleController.getArticleById);

// Update an article by ID
router.put('/:id', checkToken, upload.single('image'), articleController.updateArticle);

// Delete an article by ID
router.delete('/:id', checkToken, articleController.deleteArticle);

module.exports = router;
