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


const createPdfInvoice = (invoice)=>{
  
  console.log("pipeinvoice",invoice.invoice);
  const doc = new PDFDocument({ margin: 50 });
    // doc.pipe(fs.createWriteStream(`${Date.now()}.pdf`));
    let strcheck = `./public/invoices/${invoice.invoice}_output.pdf`;
    console.log({strcheck});
    doc.pipe(fs.createWriteStream(`./public/invoices/${invoice.invoice}_output.pdf`));
    // doc.fontSize(18).text('shopamaze', 50, 100);
    // doc.fontSize(18).text('Some text with an embedded font!', 100, 200);
    // let datestr = order.createdAt.toDateString().split(" ")
    // doc.fontSize(12).text(`Item (s) : ${order.orderItems.map((item)=>item.name)} `, 50, 150);
    // doc.fontSize(12).text(`Delivery Address :  ${order.shipping.address},${order.shipping.city},${order.shipping.postalCode},${order.shipping.country}`, 50, 200);
    // doc.fontSize(12).text(`Ordered at :  ${datestr[1]} ${datestr[2]}, ${datestr[3]}`, 50, 250);
    // doc.fontSize(12).text(`Item Price :  ${order.itemsPrice} Total Price : ${order.totalPrice}`, 50, 300);
    
    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    



  console.log("before");



  doc.end();
  

  function generateHeader(doc) {
    doc
      .image(`./public/invoices/logo.png`, 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      // .text("shopamaze.", 110, 57)
      .fontSize(10)
      .text("Complex P Street", 200, 65, { align: "right" })
      .text("India, Delhi, 110006", 200, 80, { align: "right" })
      .moveDown();
  }

  function generateCustomerInformation(doc, invoice) {

    let datestr = invoice.createdAt.toDateString().split(" ")
    const shipping = invoice.shipping;
  
    console.log("shipping",shipping);
    generateHr(doc, 185);

    doc
      .text(`Invoice Number: ${invoice.invoice}`, 50, 200)
      .text(`Invoice Date: ${datestr[1]} ${datestr[2]}, ${datestr[3]}`, 50, 215)
      
  
      .text(shipping.name, 300, 200)
      .text(shipping.address, 300, 215)
      .text(`${shipping.state} ${shipping.city}, ${shipping.country}`, 300, 230)
      .moveDown();

      generateHr(doc, 252);
  }

  function generateTableRow(doc, y, item, description, unitCost, lineTotal) {
    doc
      .fontSize(10)
      .text(item, 50, y)
      .text(description, 150, y)
      .text(unitCost, 250, y, { width: 90, align: "right" })
      .text(lineTotal, 350, y, { width: 90, align: "right" })
      // .text(c5, 0, y, { align: "right" });
  }

  function generateInvoiceTable(doc, invoice) {
    let i,
      invoiceTableTop = 330;

      doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item",
    "Unit Cost",
    "Quantity",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);

  
    for (i = 0; i < invoice.orderItems.length; i++) {
      const item = invoice.orderItems[i];
      const position = invoiceTableTop + (i + 1) * 30;
      console.log("item",item);
      generateTableRow(
        doc,
        position,
        item.name,
        formatCurrency(item.price),
        item.qty,
        formatCurrency(item.price*item.qty)
      );
      generateHr(doc, position + 20);
    }

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      subtotalPosition,
      "",
      "",
      "Subtotal : ",
      formatCurrency(invoice.totalPrice)
    );

    
  }

  function generateHr(doc, y) {
    doc
      .strokeColor("#aaaaaa")
      .lineWidth(1)
      .moveTo(50, y)
      .lineTo(550, y)
      .stroke();
  }

  function formatCurrency(amount) {
    console.log({amount});
    return "INR " + parseFloat(amount).toFixed(2);
  }



}  

export { getToken, isAuth, isAdmin, createPdfInvoice };