const express = require('express');
const cors = require('cors');
const path = require("path");

console.log('CORS_ORIGIN', process.env.CORS_ORIGIN)
console.log('PORT', process.env.PORT)
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN || `http://localhost:${PORT}`,
  optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.static(path.join(__dirname, "../build")));


const api = require('./api/index.js');


app.get('/product/data', (req, res) => {
  console.log('GET REQUEST at /product/data', req.url)
  // console.log(req.query)
  const newId = req.query.productId || null;
  const endpoints = req.query.endpoints ? req.query.endpoints.split(';') : null;
  // console.log(endpoints)
  if (newId && endpoints) {
    api.get.productData(newId, endpoints)
      .then(productRes => res.status(200).send(productRes))
      .catch(err => console.log('api.get.allProductData err', err))
  } else {
    res.status(406).send('No product id attached')
  }
})




app.post('/new',  (req, res) => {
  console.log('POST REQUEST at /new', req.url)
  console.log('query', req.query)
  console.log('body', req.body)

  const { typeId, productId, type, post } = req.body;
  console.log('newType', type)
  console.log('typeId', typeId)
  console.log('productId', productId)
  console.log('post', post)

  if (type && post) {
    api.post[type](post, productId, typeId)
      .then(postRes => res.status(204).send('created'))
      .catch(err => console.log('api.post err', req.body,  err))
  } else {
    res.status(406).send('Type/body not attached')
  }
})


app.post('/report',  (req, res) => {
  console.log('REPORT req at /report', req.url)
  console.log('query', req.query)
  console.log('body', req.body)

  const { typeId, productId, type } = req.body;
  console.log('newType', type)
  console.log('typeId', typeId)
  console.log('productId', productId)
  if (type && typeId) {
    api.post[type].report(typeId, productId)
      .then(postRes => res.status(204).send('created'))
      .catch(err => console.log('api.post.report err', req.body,  err))
  } else {
    res.status(406).send('Type/body not attached')
  }
})

app.post('/upvote',  (req, res) => {
  console.log('POST REQUEST at /upvote', req.url)
  console.log('query', req.query)
  console.log('body', req.body)

  const { typeId, productId, type } = req.body;
  console.log('type', type)
  console.log('typeId', typeId)
  console.log('productId', productId)
  if (type && typeId) {
    api.post[type].helpful(typeId, productId)
      .then(postRes => res.status(204).send('created'))
      .catch(err => console.log('api.post.upvote err', req.body, err))
  } else {
    res.status(406).send('Type/body not attached')
  }
})

app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`);