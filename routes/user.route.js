const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const checkClientToken = require("../middleware/checkClientToken");
const checkAdminToken = require("../middleware/checkAdminToken");

// Obtenir tous les utilisateurs (admin uniquement)
router.get("/", checkAdminToken, userController.getUsers);

// Obtenir un utilisateur par ID (client uniquement)
router.get("/:id", checkClientToken, userController.getUserById);

// Mettre à jour l'email de l'utilisateur (client uniquement)
router.put("/email", checkClientToken, userController.updateEmail);

// Mettre à jour le mot de passe de l'utilisateur (client uniquement)
router.put("/password", checkClientToken, userController.updatePassword);

// Supprimer un utilisateur (admin uniquement)
router.delete("/:id", checkAdminToken, userController.deleteUser);

module.exports = router;
