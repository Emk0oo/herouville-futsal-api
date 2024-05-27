const connection = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

// Create a new article
exports.createArticle = async (req, res) => {
    const { date, title, title2, title3, entete, content, content2, author } = req.body;
    let imageBase64 = null;

    try {
        if (req.file) {
            const imageBuffer = req.file.buffer;
            console.log(`Image buffer size: ${imageBuffer.length} bytes`);
            imageBase64 = imageBuffer.toString('base64');
            console.log(`Base64 length: ${imageBase64.length} characters`);
        }

        const query = `
            INSERT INTO actualites (date, imageBase64, title, title2, title3, entete, content, content2, author) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        connection.query(query, [date, imageBase64, title, title2, title3, entete, content, content2, author], (err, results) => {
            if (err) {
                console.error("Database query error:", err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: results.insertId, date, imageBase64, title, title2, title3, entete, content, content2, author });
        });
    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Get all articles
exports.getArticles = (req, res) => {
    const query = 'SELECT * FROM actualites';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
};

// Get a single article by ID
exports.getArticleById = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM actualites WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }
        res.status(200).json(results[0]);
    });
};

// Update an article by ID
exports.updateArticle = async (req, res) => {
    const { id } = req.params;
    const { date, title, title2, title3, entete, content, content2, author } = req.body;

    try {
        const getCurrentImageBase64Query = 'SELECT imageBase64 FROM actualites WHERE id = ?';
        const [currentImageResult] = await connection.promise().query(getCurrentImageBase64Query, [id]);
        if (currentImageResult.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        let imageBase64 = currentImageResult[0].imageBase64;

        if (req.file) {
            const imageBuffer = req.file.buffer;
            imageBase64 = imageBuffer.toString('base64');
        }

        const query = `
            UPDATE actualites 
            SET date = ?, imageBase64 = ?, title = ?, title2 = ?, title3 = ?, entete = ?, content = ?, content2 = ?, author = ?
            WHERE id = ?
        `;
        const params = [date, imageBase64, title, title2, title3, entete, content, content2, author, id];

        connection.query(query, params, (err, results) => {
            if (err) {
                console.error("Database query error:", err.message);
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Article not found' });
            }
            res.status(200).json({ id, date, title, title2, title3, entete, content, content2, author, imageBase64 });
        });
    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ error: error.message });
    }
};

// Delete an article by ID
exports.deleteArticle = (req, res) => {
    const { id } = req.params;

    const getCurrentImageBase64Query = 'SELECT imageBase64 FROM actualites WHERE id = ?';
    connection.query(getCurrentImageBase64Query, [id], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const imageBase64 = results[0].imageBase64;
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const imageName = `image_${id}`;
        const imagePath = path.join(__dirname, '../uploads', imageName);

        const deleteQuery = 'DELETE FROM actualites WHERE id = ?';
        connection.query(deleteQuery, [id], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: 'Article not found' });
            }

            try {
                await fs.unlink(imagePath);
                console.log("Image file deleted successfully.");
            } catch (unlinkErr) {
                console.error("Failed to delete the image file:", unlinkErr.message);
            }

            res.status(204).send();
        });
    });
};
