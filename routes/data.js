const router=require('express').Router();
const Data=require('../models/Data');
const nodemailer = require('nodemailer');
const  dotenv=require("dotenv");
const puppeteer = require('puppeteer');
const fs=require('fs');
dotenv.config();
const numberToWords = require('number-to-words');

convertAmounttoWords=(amount)=>{
    const options = {
        language: 'en',
        and: true,
    };

    return numberToWords.toWords(amount, options);
}


//ADD
router.post("/add",async (req,res)=>{
    try{
    const newData=new Data({
        receiptNumber:req.body.receiptNumber,
        name:req.body.name,
        email:req.body.email,
        mobile:req.body.mobile,
        aadhar:req.body.aadhar,
        address:req.body.address,
        paymentMode:req.body.paymentMode,
        amount:req.body.amount
    });
    const amountinWords=convertAmounttoWords(newData.amount);
        
        const transporter=nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.AUTH_KEY,
                },
            }
            );

            const htmlTemplate=fs.readFileSync('routes/templates/template.html', 'utf-8');
            const filledTemplate = htmlTemplate
            .replace('{invoice}',newData.receiptNumber)
            .replace('{name}', newData.name)
            .replace('{email}', newData.email)
            .replace('{id}',newData.aadhar)
            .replace('{mobile}',newData.mobile)
            .replace('{address}',newData.address)
            .replace('{amt}',amountinWords.replace(/th$/,' only'))
            .replace('{pmode}',newData.paymentMode)
            .replace('{amount}',newData.amount)
            .replace('{res}',newData.receiptNumber);


            const browser=await puppeteer.launch();
            const page=await browser.newPage();
            await page.setContent(filledTemplate);
            const pdfBuffer = await page.pdf();
            await browser.close();

            const mailOptions = {
                from: process.env.EMAIL,
                to: newData.email,
                subject: 'Payment Confirmation',
                html: 'Attached is your Payment receipt.',
                attachments: [
                    {
                        filename: 'payment.pdf',
                        content: pdfBuffer,
                        encoding: 'base64',
                    },
                ],
            };

            const data=await newData.save();
            await transporter.sendMail(mailOptions);
            
        res.status(201).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

//GET ALL
router.get("/view",async (req,res)=>{
    try{
        const data=await Data.find();
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
});

//GET
router.get('/view/:id',async (req,res)=>{
    try{
        const data=await Data.findById(req.params.id);
        res.status(200).json(data);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports=router;