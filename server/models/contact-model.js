const mongoose = require("mongoose");

const contactSchema= new mongoose.Schema({
name:{
    type:String,
    required:true,

},
email:{
type:String,
required:true,
},
phone:{
type:String,
required:true,
},

description:{
    type:String,
    required:true,
},
status:{
    type:String,
    enum:["PENDING","RESOLVED"],
    default:"PENDING",
},




}, {timestamps:true,})

module.exports=mongoose.model("Contact",contactSchema)

