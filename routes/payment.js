import express from "express";
import Razorpay from "razorpay";
import config from "../config.js";
import shortid from "shortid";

const router = express.Router();

const razorpay = new Razorpay({
	key_id: config.KEY_CLIENT_ID,
	key_secret: config.KEY_SECRET_ID
})

router.post('/', async (req, res) => {
	const payment_capture = 1
	const amount = 499
	const currency = 'INR'

	const options = {
		amount: amount * 100,
		currency,
		receipt: shortid.generate(),
		payment_capture
	}

	try {
		const response = await razorpay.orders.create(options)
		console.log("razorpay order",response)
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

export default router;