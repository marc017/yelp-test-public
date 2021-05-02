const express = require('express');
const yelp = require('./routes/yelp');
const helmet = require('helmet');
const compression = require('compression');
const config = require('config');
const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(helmet());
app.use(compression());

// routes
app.use('/api/yelp', yelp);

const port = process.env.PORT || config.get('port');
app.listen(port, function () {
  console.log(`Server started on port ${port}...`);
});
