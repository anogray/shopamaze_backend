import express from 'express';
import { createPdfInvoice, isAuth } from "../util.js";
import PDFDocument  from "pdfkit";
import fs from "fs";
import Order from '../model/orderModel.js';
import path from 'path';
const __dirname = path.resolve();

const router = express.Router();

router.post("/",async(req,res)=>{
    // console.log("reqbody",req.body);
try{
    const orderedDetails = await Order.findById(req.body.orderId);
    // console.log("orderedDetails",orderedDetails);
    console.log("__dirname",__dirname,process.cwd());

    // console.log("got success",order); 
    createPdfInvoice(orderedDetails);
    console.log("after");

    // var file = __dirname + "\\" + `public\\invoices\\${orderedDetails._id}_output.pdf`;
    // var file = "localhost:3004/invoices"+ `/${orderedDetails._id}_output.pdf`;
    var file = "/invoices"+ `/${orderedDetails._id}_output.pdf`;
    //  var file =fs.readFileSync('./output.pdf');
    //  var file =fs.readFileSync(`./public/invoices/${orderedDetails._id}_output.pdf`,"utf-8");
     //doc.pipe(fs.createWriteStream(`./public/invoices/${orderedDetails._id}_output.pdf`));
     console.log("op",file);
// res.contentType("application/pdf");
// res.send({"msg":"true",file});

// fs.readFile(file, function (err,data){
//     res.contentType("application/pdf");
//     res.send(data);
// });

// res.download(file, function (err) {
//     if (err) {
//         console.log("Error");
//         console.log(err);
//     } else {
//         console.log("Success",file);
//     }    
// });

  res.status(200).send({"msg":"okay",fileUrl:`${file}`});

}catch(err){
console.log("error pdf",err);
}


})

export default router;