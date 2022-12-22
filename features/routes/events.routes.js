const express=require("express")
const { createEvent, getAllEvents, getSingleEvent } = require("../controllers/events.controller")
const authMiddleware = require("../middlewares/users.middleware")
const route=express.Router()

route.post("/create",authMiddleware,async(req,res)=>{
    const {name,description,timing,place,capacity,userID,category}=req.body
     const response=await createEvent(name,description,timing,place,capacity,userID,category)
     if(response.message==="Successful")
     {
        return res.send(response)
     }
    return res.status(406).send(response) 
})

route.get("/",async(req,res)=>{
    const {filter,query}=req.query
    const response=await getAllEvents(filter,query)
    if(response.message==="Successful")
    {
        return res.send(response)
    }
    return res.status(500).send(response)
})

route.get("/:id",authMiddleware,async(req,res)=>{
    const {id}=req.params
      const response=await getSingleEvent(id)
      if(response.message==="Successful")
      {
        return res.send(response)
      }
    return res.status(406).send(response)  
})
module.exports=route