const express=require("express");
const app=express();
const mongoose=require("mongoose");
const  dotenv=require("dotenv");
const dataRoute=require('./routes/data');
var cors = require('cors')

app.use(cors())

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("db connected");
}).catch((err)=>{
    console.log(err);
});

app.use(express.json());

app.use("/api/data",dataRoute);


app.listen(8810,()=>{
    console.log("server running");
})