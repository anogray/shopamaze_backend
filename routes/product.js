// const router = require("express").Router();
// import {router} from "express/Router"
// const router = require("express").Router();

import express from 'express';
import data from "../data.js";
import { isAuth, isAdmin} from "../util.js";
import Product from '../model/productModel.js';

const router = express.Router();

router.get("/",async(req,res)=>{
  const data = await Product.find({});
  console.log("getalldata",data);
    res.status(200).json({"data":data});
})

router.get("/:id", async(req,res)=>{
    const productId = req.params.id;
    console.log("prodtId",productId)
    const prodData = await Product.findById(productId);
    if(prodData){
        res.status(200).json(prodData);
    }
    else{
        res.status(404).send({msg: "Product Not Found"});
    }
})

router.delete('/:id', isAuth, isAdmin, async (req, res) => {
    const deletedProduct = await Product.findById(req.params.id);
    if (deletedProduct) {
      await deletedProduct.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.send('Error in Deletion.');
    }
  });
  
  router.post('/', isAuth, isAdmin, async (req, res) => {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      brand: req.body.brand,
      category: req.body.category,
      countInStock: req.body.countInStock,
      description: req.body.description,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
    });
    const newProduct = await product.save();
    if (newProduct) {
      return res
        .status(201)
        .send({ message: 'New Product Created', data: newProduct });
    }
    return res.status(500).send({ message: ' Error in Creating Product.' });
  });

  router.put('/:id', isAuth, isAdmin, async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        return res
          .status(200)
          .send({ message: 'Product Updated', data: updatedProduct });
      }
    }
    return res.status(500).send({ message: ' Error in Updating Product.' });
  });

  router.post("/ordered", async(req,res)=>{
    
  })

export { router as products };
