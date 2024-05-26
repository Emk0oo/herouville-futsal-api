const connection = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const transporterEmail= process.env.MAILER_EMAIL;
const transporterPassword= process.env.MAILER_PASSWORD;

dotenv.config();

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


exports.register = (req, res) => {
  const { email, password, nom, prenom } = req.body;

  const checkUserQuery = "SELECT * FROM utilisateurs WHERE email = ?";
  connection.query(checkUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });

    if (results.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const registerUserQuery = "INSERT INTO utilisateurs (email, password, nom, prenom, role_id) VALUES (?, ?, ?, ?, 2)";

    connection.query(registerUserQuery, [email, hashedPassword, nom, prenom], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      const mailOptions = {
        from: process.env.MAILER_EMAIL,
        to: email,
        subject: "Bienvenue sur le site d'Hérouville Futsal ! 🎉",
        text: `Bonjour ${prenom} ${nom},\n\nNous sommes ravis de vous accueillir sur le site d'Hérouville Futsal ! Votre inscription a été confirmée avec succès. Vous pouvez désormais vous connecter et profiter de tous nos services.\n\nSi vous avez des questions ou avez besoin d'aide, n'hésitez pas à nous contacter.\n\nÀ très bientôt sur le terrain,\nL'équipe Hérouville Futsal`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return res.status(500).json({ error: "Error sending email" });
        }
        res.status(201).json({ message: "User registered successfully and email sent" });
      });
    });
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  const query = "SELECT * FROM utilisateurs WHERE email = ?";

  connection.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    res.json({ token });
  });
};

exports.forgotPassword = (req, res) => {
  const { email } = req.body;
  const query = 'SELECT * FROM utilisateurs WHERE email = ?';

  connection.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (results.length === 0) return res.status(404).json({ error: 'User not found' });

    const user = results[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const mailOptions = {
      from: process.env.MAILER_EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: http://localhost:3000/login/reset-password/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.json({ message: 'Password reset email sent' });
    });
  });
};

exports.resetPassword = (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    const query = 'UPDATE utilisateurs SET password = ? WHERE id = ?';
    connection.query(query, [hashedPassword, decoded.id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Password updated successfully' });
    });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid or expired token' });
  }
};

module.exports = exports;