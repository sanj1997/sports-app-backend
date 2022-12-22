const UserModel = require("../models/users.model");
const crypto=require("crypto-js")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const createUser=async(name,email,password)=>{
    let response;
    try{
         const checkIsExisting=await UserModel.findOne({email:email})
         if(checkIsExisting)
         {
            response={message:"Account already exists"}
         }
         else
         {
            const hashed_password=crypto.AES.encrypt(password,process.env.PASSWORD_SECRET).toString()
            const newUser=await UserModel.create({name:name,email:email,password:hashed_password})
            response={message:"Account created successfully"}
         }
    }catch(e){
        response={message:e.message}
    }
    return response
}

const authenticateUser=async(email,password)=>{
    let response
    try{
        const validateUser=await UserModel.findOne({email:email})
        const password_db = crypto.AES.decrypt(validateUser.password, `${process.env.PASSWORD_SECRET}`).toString(crypto.enc.Utf8)
         if(!validateUser||password_db!=password)
         {
            response={message:"Invalid credentials"}
         }
         else
         {
            const accessToken=jwt.sign({id:validateUser._id},process.env.ACCESS_TOKEN_PASSWORD,{
                expiresIn:"7 days"
            })

            const refreshToken=jwt.sign({id:validateUser._id},process.env.REFRESH_TOKEN_PASSWORD,{
                expiresIn:"60 days"
            })
            response={message:"Login Successful",accessToken:accessToken,refreshToken:refreshToken,id:validateUser._id,name:validateUser.name}
         }
    }catch(e){
        response={message:e.message}
    }
    return response
}

const reAuthenticateUser=async(refreshToken)=>{
    let response;
    try {
        const data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PASSWORD)
        delete data.exp
        delete data.iat
        const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_PASSWORD, {
            expiresIn: "7 days"
        })
        response = { message: "successful", accessToken: accessToken }
    } catch (e) {
        response = { message: e.message }
    }
    return response
}

const getUserDetails=async(id)=>{
     let response
     try{
        const user=await UserModel.findById(id)
        let data={name:user.name,id:user._id}
        response={message:"Successful",data:data}
     }catch(e){
        response={message:e.message}
     }
     return response
}
module.exports={createUser,authenticateUser,reAuthenticateUser,getUserDetails}