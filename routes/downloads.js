import express from 'express';
import { createPdfInvoice, isAuth } from "../util.js";
import PDFDocument  from "pdfkit";
import fs from "fs";
import Order from '../model/orderModel.js';
import path from 'path';
import mailer from "../routes/mailer.js"
const __dirname = path.resolve();

const router = express.Router();

router.post("/",async(req,res)=>{
     console.log("reqbody",req.body);
try{
  const {toInvoice} = req.body;
    const orderedDetails = await Order.findById(req.body.orderId);
    // console.log("orderedDetails",orderedDetails);
    console.log("__dirname",__dirname,process.cwd());

    // console.log("got success",order);
     
    createPdfInvoice(orderedDetails);
    console.log("before toInvoice download",orderedDetails.invoice);

    if(toInvoice=="download"){
         console.log("toInvoice download",orderedDetails.invoice);

      var file = "/invoices"+ `/${orderedDetails.invoice}_output.pdf`;
      return res.status(200).json({"success":"true",fileUrl:`${file}`});
    }else{
      let resp = await mailer(orderedDetails.invoice);
     return res.status(200).json({"success":"true",email:true});
    }
    
      
    
  
    console.log("after",resp);

    //var file = __dirname + "\\" + `public\\invoices\\${orderedDetails._id}_output.pdf`;
     //var file = "localhost:3004/invoices"+ `/${orderedDetails._id}_output.pdf`;
    // var file = "/invoices"+ `/${orderedDetails._id}_output.pdf`;
    //  var file =fs.readFileSync('./output.pdf');
    //  var file =fs.readFileSync(`./public/invoices/${orderedDetails._id}_output.pdf`,"utf-8");
     //doc.pipe(fs.createWriteStream(`./public/invoices/${orderedDetails._id}_output.pdf`));
     console.log("op",file);


// res.download(file, function (err) {
//     if (err) {
//         console.log("Error");
//         console.log(err);
//     } else {
//         console.log("Success",file);
//     }    
// });
}catch(err){
console.log("error pdf",err);
}


})



export default router;