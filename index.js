require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const dns = require('dns')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});



function isValidURL(params) {
  try {
    const url = new URL(params)
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (error) {
    return false
  }
}

app.post("/api/shorturl", (req, res, next) => {
  const url = req.body.url;
  if (!isValidURL(url)) {
    return res.json({ error: 'invalid url' })
  }

  const hostname = new URL(url).hostname
  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: 'invalid url' })
    }
  })
  const shorted = Math.floor(Math.random() * 11);
  req.body.short_url = shorted;
  app.get(`/api/shorturl/${shorted}`, (req, res) => {
    res.redirect(url)
  })
  next();
}, (req, res) => {
  res.json({
    original_url: req.body.url,
    short_url: parseInt(req.body.short_url),
  })
})




// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
