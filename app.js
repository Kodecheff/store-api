const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders')

// Connecting to MongoDB
mongoose.connect('mongodb+srv://shop-api:' + process.env.MONGO_ATLAS_PW + '@shop-api-kmvef.mongodb.net/test?retryWrites=true&w=majority',
{
  useNewUrlParser: true,
  useUnifiedTopology: true
})


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// Handling CORS error (connect client to server)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Header', 
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if(req.methods === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, PATCH, DELETE')
    return res.status(200).json({})
  }
  next()
})

//Connect routes
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Handling error
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error)
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app;