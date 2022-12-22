const express=require("express")
const { createUser, authenticateUser, reAuthenticateUser, getUserDetails } = require("../controllers/users.controller")
const route=express.Router()
const authMiddleware=require("../middlewares/users.middleware")
route.post("/sign-up",async(req,res)=>{
    const {email,name,password}=req.body
    const response=await createUser(name,email,password)
    if(response.message==="Account already exists")
    {
        return res.status(401).send(response)
    }
    else if(response.message==="Account created successfully")
    {
        return res.send(response)
    }
    return res.status(401).send(response)
})

route.post("/sign-in",async(req,res)=>{
    const {email,password}=req.body
    const response=await authenticateUser(email,password)
    if(response.message==="Invalid Credentials")
    {
        return res.status(401).send(response)
    }
    else if(response.message==="Login Successful")
    {
        return res.send(response)
    }
    return res.status(401).send(response)
})

route.get("/refresh",async(req,res)=>{
    const refreshToken=req.headers.authorization
    const response=await reAuthenticateUser(refreshToken)
    if(response.message==="successful")
    {
        return res.send(response)
    }
    return res.status(401).send(response)
})

route.get("/details",authMiddleware,async(req,res)=>{
      const {userID}=req.body
      const response=await getUserDetails(userID)
      if(response.message==="Successful")
      {
        return res.send(response)
      }
    return res.status(401).send(response)  
})
module.exports=route