import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import config from "./config.js";
// const product = require("./routes/product");
import {products } from "./routes/product.js";
import  userRoute  from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js"
import payment from "./routes/payment.js";
import download from "./routes/downloads.js";
import path from 'path';
const __dirname = path.resolve();
console.log("__dirname",__dirname,process.cwd());


const app = express();
app.use(express.json());

dotenv.config();
app.use(morgan('tiny'));
app.use(cors());

app.use('/invoices',express.static(path.join(__dirname, 'public/invoices')));


mongoose.connect(config.MONGODB_URL ,  
{ useNewUrlParser: true , useUnifiedTopology: true }, (err)=>{

if(err) return console.error(err);

console.log("Connected to MongoDb");
});

const PORT = process.env.PORT || 3002;

app.get("/",(req,res)=>{
    res.send("server accessible");
})

app.use('/api/users', userRoute);
// app.use('/api/uploads', uploadRoute);
app.use("/api/products",products );
app.use('/api/orders', orderRoute);
app.use("/api/razorpay", payment);
app.use("/api/download", download);



app.listen(PORT, ()=> console.log(`Server is running up at ${PORT}`));
