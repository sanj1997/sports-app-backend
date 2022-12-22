const {Schema,model} =require("mongoose")

const UserSchema= new Schema({
    name:{type:String,require:true},
    email:{type:String,unique:true,require:true},
    password:{type:String,require:true}
})

const UserModel=model("user",UserSchema)
module.exports=UserModel