const express = require('express');
const app = express();
const port = 4000;
const cors = require('cors');
const checkToken = require('./middleware/checkAdminToken.js');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.use('/article', require('./routes/article.route.js'));
app.use('/auth', require('./routes/auth.route.js'));
app.use('/user', require('./routes/user.route.js'));

// app.use('/player', require('./routes/player.route.js'));
// app.use('/calendar', require('./routes/calendar.route.js'));
