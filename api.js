const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(bodyParser.json({ limit: '10mb' })); // Adjust limit as necessary
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Adjust limit as necessary

app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
  })
);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/article', require('./routes/article.route.js'));
app.use('/auth', require('./routes/auth.route.js'));
app.use('/user', require('./routes/user.route.js'));
app.use('/product', require('./routes/product.route.js'));
app.use('/payment', require('./routes/payment.route.js'));
// app.use('/player', require('./routes/player.route.js'));
// app.use('/calendar', require('./routes/calendar.route.js'));

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;
module.exports.handler = serverless(app);
