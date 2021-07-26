
import nodemailer from 'nodemailer';
import config from "../config.js"
import path from "path";
const __dirname = path.resolve();

// router.post("/", (req,res)=>{
const mailer = async(orderId)=> {
    console.log("inside mailer")

        
        const transporter = nodemailer.createTransport({
            port: 465,               // true for 465, false for other ports
            host: "smtp.gmail.com",
            auth: {
                    user: config.MAIL_USERNAME,
                    pass: config.MAIL_PASS,
                },
            secure: true,
            });
                

        const mailData = {
            from: `${config.MAIL_USERNAME}`,  // sender address
                to: `${config.MAIL_USERNAME}`,   // list of receivers
                subject: 'shopamaze Invoice',
                html: `<b>Attachments of the invoice </b>`,
                // attachments: [{
                //     filename: `${orderId}_output.pdf`,
                //     path: `${__dirname}/public/invoices/${orderId}_output.pdf`,
                //     contentType: 'application/pdf'
                //   }],
                        
            };

            // req.session.email = email
            // req.session.password = password
            // req.session.otp = OTP;

            // console.log("mailing mailer",req.session)
            
            let resp = await transporter.sendMail(mailData) 
            console.log("await",resp);

            // transporter.sendMail(mailData, function (err, info) {
            //     if(err){
            //         console.log({err})
            //        // return res.status(500).json({"Mail":"Error"})
            //     }
                    
            //     else{
            //         console.log("email sent");
            //         return true;
            //     }
            //     });

            return resp;
}

export default mailer;
// module.exports = router