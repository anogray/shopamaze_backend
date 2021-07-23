import jwt from 'jsonwebtoken';
import config from './config.js';
import PDFDocument  from "pdfkit";
import fs from "fs";




const getToken = (user) => {

  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    config.JWT_SECRET,
    {
      expiresIn: '48h',
    }
  );
};

const isAuth = (req, res, next) => {

    const token = req.headers.authorization;
      console.log({token});
    if (token) {
      const onlyToken = token.slice(7, token.length);
      jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
        if (err) {
          return res.status(401).send({ message: 'Invalid Token' });
        }
        console.log("decode",decode);
        req.user = decode;
        next();
        return;
      });
    } else {
      return res.status(401).send({ message: 'Token is not supplied.' });
    }
  };
  
  const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user && req.user.isAdmin) {
      return next();
    }
    return res.status(401).send({ message: 'Admin Token is not valid.' });
  };


const createPdfInvoice = (order)=>{

  const doc = new PDFDocument();
    // doc.pipe(fs.createWriteStream(`${Date.now()}.pdf`));
    doc.pipe(fs.createWriteStream(`./public/invoices/${order._id}_output.pdf`));
    doc.fontSize(18).text('shopamaze', 50, 100);
    // doc.fontSize(18).text('Some text with an embedded font!', 100, 200);
    let datestr = order.createdAt.toDateString().split(" ")
    doc.fontSize(12).text(`Item (s) : ${order.orderItems.map((item)=>item.name)} `, 50, 150);
    doc.fontSize(12).text(`Delivery Address :  ${order.shipping.address},${order.shipping.city},${order.shipping.postalCode},${order.shipping.country}`, 50, 200);
    doc.fontSize(12).text(`Ordered at :  ${datestr[1]} ${datestr[2]}, ${datestr[3]}`, 50, 250);
    doc.fontSize(12).text(`Item Price :  ${order.itemsPrice} Total Price : ${order.totalPrice}`, 50, 300);
    
    

    doc
  .save()
  // .moveTo(100, 150)
  // .lineTo(100, 250)
  // .lineTo(200, 250)

  console.log("before");

  doc.end();
  
}  

export { getToken, isAuth, isAdmin, createPdfInvoice };