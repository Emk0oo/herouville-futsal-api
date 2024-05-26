const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const transporterEmail = process.env.MAILER_EMAIL;
const transporterPassword = process.env.MAILER_PASSWORD;

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: transporterEmail,
    pass: transporterPassword,
  },
});

exports.getUsers = (req, res) => {
  const query = "SELECT * FROM utilisateurs";
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
};

exports.getUserById = (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM utilisateurs WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(results[0]);
  });
};

exports.updateEmail = (req, res) => {
  const { newEmail } = req.body;
  const userId = req.user.id;

  const query = 'UPDATE utilisateurs SET email = ? WHERE id = ?';
  connection.query(query, [newEmail, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json({ message: 'Email updated successfully' });
  });
};

exports.updatePassword = (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  const query = 'SELECT password FROM utilisateurs WHERE id = ?';
  connection.query(query, [userId], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid old password' });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    const updateQuery = 'UPDATE utilisateurs SET password = ? WHERE id = ?';
    connection.query(updateQuery, [hashedPassword, userId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.status(200).json({ message: 'Password updated successfully' });
    });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM utilisateurs WHERE id = ?";
  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  });
};
