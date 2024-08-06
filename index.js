const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
require('dotenv').config();
const app = express(); 
const authJwt = require('./helper/jwt.js')

app.use(express.json())
app.use(cors())
app.use(bodyParser.json());
// app.use(authJwt());         
   
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.cloudinary_Config_Cloud_name,
  api_key: process.env.cloudinary_Config_API_key,    
  api_secret: process.env.cloudinary_Config_API_secret,
  secure: true, 
}); 

// Adding to cart
const cartSchema = new mongoose.Schema({
    userId: String,
    productTitle: String,
    images: String,
    price: Number,
    quantity: Number,
    subTotal: Number,
    productId: String,
    size: String,
    ram: String
  });
  
  const Cart = mongoose.model('Cart', cartSchema);
  
  // Adding to cart
  app.post('/api/cart/add', (req, res) => {
      const { userId, productTitle, images, price, quantity, subTotal, productId, size, ram } = req.body;
      // Save the cart item with the userId
      Cart.create({ userId, productTitle, images, price, quantity, subTotal, productId, size, ram })
        .then(() => res.send({ success: true }))
        .catch((err) => res.status(500).send({ error: "Failed to add item to cart" }));
  });
  
  // Fetching cart items
  app.get('/api/cart', (req, res) => {
      const { userId } = req.query;
      // Fetch cart items for the specific userId
      Cart.find({ userId })
        .then(items => res.send(items))
        .catch(err => res.status(500).send({ error: "Failed to fetch cart items" }));
  });

const userRoutes = require('./routes/user.js')
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/products'); 
const ImagesUpload = require("./helper/ImagesUpload")
const cart = require("./routes/carts.js");
const productReview = require('./routes/productReview.js');
const checkoutPayment = require('./routes/checkout.js');
const orderList = require('./routes/order.js')
const searchProduct= require('./routes/search.js')


app.use('/uploads',express.static("uploads"));
app.use('/api/imageuploads', ImagesUpload);
app.use('/api/categorys',categoryRoutes);
app.use('/api/products',productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cart);
app.use('/api/productReview', productReview);
app.use('/api/checkout', checkoutPayment);
app.use('/api/order', orderList);
app.use('/api/search', searchProduct);

app.listen(process.env.port,()=>{
    console.log(`Server is running Port ${process.env.port}`)
});

mongoose.connect(process.env.DATABASE_STRING)

const databds = mongoose.connection;
 
databds.on('error',(error)=>{
    console.log(error,"not connnect")
})
databds.once('connected',()=>{
    console.log("Database connected")
})
