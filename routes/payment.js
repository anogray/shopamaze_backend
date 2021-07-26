import express from "express";
import Razorpay from "razorpay";
import config from "../config.js";
import shortid from "shortid";
import crypto from 'crypto';
import fs from "fs";
import Order from '../model/orderModel.js';
import  Mongoose  from "mongoose";

const router = express.Router();

const razorpay = new Razorpay({
	key_id: config.KEY_CLIENT_ID,
	key_secret: config.KEY_SECRET_ID
})

router.post('/', async (req, res) => {
	console.log("order details",req.body,req.body._id);
	const payment_capture = 1
	const amount = req.body.totalPrice
	const currency = 'INR'

	
	try {

		const options = {
			amount: amount * 100,
			currency,
			receipt: shortid.generate(),
			payment_capture,
			// order_id:req.body._id
			notes:[req.body._id]
		}
		const response = await razorpay.orders.create(options)
		console.log(" response order created /", response)
		const ordered = await Order.findById(req.body._id);
		ordered.payment = {
			paymentMethod: 'visa',
			paymentResult: {
			   razorpayOrderID: response.id,
			  receipt: response.receipt
			}
		  }
		
		  const updatedOrder = await ordered.save();
		 // console.log(" ordered /", updatedOrder)
		  
		res.json({
			id: response.id,
			currency: response.currency,
			amount: response.amount,
            client_Id: config.KEY_CLIENT_ID
		})
	} catch (error) {
		console.log(error)
	}
})

router.post("/verification", async(req,res)=>{
	console.log("verified api")

	let paymentsuccess = '';
	try{
		const secret = 123456789+"";
	
		// console.log(req.method);
		//console.log("verification",(req.body.payload.payment.entity));
		//console.log("headers verification",(req.headers));
	
	
		const shasum = crypto.createHmac('sha256', secret)
		shasum.update(JSON.stringify(req.body))
		const digest = shasum.digest('hex')
	
		console.log(digest, req.headers['x-razorpay-signature'])
	
		if (digest === req.headers['x-razorpay-signature']) {
			// console.log('request is legit',req.body.payload.payment)
			// process it
			// fs.writeFileSync('payment1.json', JSON.stringify(req.body, null, 4))
	
			const checkProductOrdered = req.body.payload.payment.entity.notes[0];
			//console.log("check notes",req.body.payload.payment.entity,checkProductOrdered);
			let ordered = await Order.findById({_id:Mongoose.Types.ObjectId(checkProductOrdered)});
			console.log("ordered to verify",ordered);
			ordered.isPaid = true;
			ordered.payment.paymentResult.paymentId = req.body.payload.payment.entity.id;
			ordered.payment.paymentMethod =req.body.payload.payment.entity.method;
			
			const countInvoice = await Order.find({"payment.paymentResult.paymentId" :{ $exists:"true"}}).count();
			console.log({countInvoice});
			ordered.invoice = "INV-"+countInvoice;
			const verifiedOrder = await ordered.save();
			console.log("verifiedOrder",verifiedOrder);
			paymentsuccess = verifiedOrder;
			return res.status(200).json({paymentsuccess:verifiedOrder});
		}
		
	}catch(err){
		console.log("error await",err.message);
	}
		
	return res.json({msg:paymentsuccess});
})

export default router;