const mongoose=require("mongoose")

const dBconnect=()=>{
    return mongoose.connect("mongodb+srv://s:sanjay1997@cluster0.qnkuqjj.mongodb.net/sports")
}

module.exports=dBconnect