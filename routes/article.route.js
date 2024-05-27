const express = require('express');
const multer = require('multer');
const router = express.Router();
const actualitesController = require('../controllers/article.controller');

// Multer configuration with file size and field size limits
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB for files
        fieldSize: 10 * 1024 * 1024 // 10 MB for non-file multipart form fields
    }
});

router.post('/', upload.single('image'), actualitesController.createArticle);
router.get('/', actualitesController.getArticles);
router.get('/:id', actualitesController.getArticleById);
router.put('/:id', upload.single('image'), actualitesController.updateArticle);
router.delete('/:id', actualitesController.deleteArticle);

module.exports = router;
