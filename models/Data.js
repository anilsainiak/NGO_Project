const mongoose=require('mongoose');

const dataSchema=mongoose.Schema(
    {
        receiptNumber:{type:String,required:true,unique:true},
        name:{type:String,required:true},
        email:{type:String,required:true},
        mobile:{type:String,required:true},
        aadhar:{type:String,required:true},
        address:{type:String,required:true},
        paymentMode:{type:String,required:true},
        amount:{type:Number,required:true}
    },{timestamps:true}
)

module.exports=mongoose.model('Data',dataSchema);