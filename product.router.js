const express = require('express');
const router = express.Router();
const mongoose = require("mongoose")
const {extend} = require("lodash");

//To create DB entries with Mongoose

//Step 1 : Mongoose Schema

const ProductSchema = new mongoose.Schema({ name: String, price: Number });

//Step 2 : Model creation using schema

const Product = mongoose.model("Product", ProductSchema);

//Would come from DB
// const products = [
//   {id: 1, name: "Boots", price: 500},
//   {id: 2, name: "Jeans", price: 700}
// ]

// let idCounter = 123

router.route("/")
.get(async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({success: true, products})
    console.log(Product)
  }
  catch(err) {
    res.status(500).json({success: false, message: "Unable to get products", errorMessage: err.mesage})
  }
})
.post(async (req, res) => {
try {
    const product = req.body;
    const NewProduct = new Product(product);
    const savedProduct = await NewProduct.save();
    res.json({ success: true, product: savedProduct })
  } catch (err) {
    res.status(500).json({ success: false, message: "unable to add products", errorMessage: err.message})
  }
} )
// .post((req, res) => {
//   const {name, price} = req.body;
//   const product = {id : idCounter++, name, price}
//   products.push(product)
//   res.json({success: true, product})
// } )

router.param("productId", async (req, res, next, productId) => {
  try {
    const product = await Product.findById(productId);
    
    if(!product) {
      return res.status(400).json({success: false, message: "Error getting product"})
    }
    
    req.product = product;
    console.log(req.product)
    next();
  }
  catch {
    res.status(400).json({success: false, message: "Error while retrieving the products...."})
  }
})


router.route("/:productId")
.get((req, res) => {
  const {product} = req; // To read by id
  product.__v = undefined; // to remove __v from output
  res.json({success: true, product})
})
.post(async (req,res) => {
  const productUpdates = req.body;
  let {product} = req;
  product = extend(product, productUpdates);
  product = await product.save();
  product.__v = undefined; // to remove __v from output
  res.json({success: true, product}) 
})
.delete(async (req,res) => {
  let {product} = req;
  await product.remove();
  res.json({success: true, product}) 
})


module.exports = router