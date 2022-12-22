const express=require("express")
const { createBooking, getBookings, updateBooking, getUserBookings } = require("../controllers/bookedEvents.controller")
const { getUserDetails } = require("../controllers/users.controller")
const authMiddleware = require("../middlewares/users.middleware")
const route=express.Router()

route.post("/",authMiddleware,async(req,res)=>{
    const response=await createBooking(req.body)
    if(response.message==="Successful")
    {
        return res.send(response)
    }
    else if(response.message==="Event has expired")
    {
        return res.status(403).send(response)
    }
    else if(response.message==="Seats not available")
    {
        return res.status(403).send(response)
    }
    else if(response.message==="You have already booked this event")
    {
        return res.status(403).send(response)
    }
    return res.status(406).send(response)
})

route.get("/",authMiddleware,async(req,res)=>{
     const {userID}=req.body
     const response=await getBookings(userID)
     if(response.message==="Successful")
     {
        return res.send(response)
     }
     return res.status(406).send(response)
})

route.patch("/:id",authMiddleware,async(req,res)=>{
    const {id}=req.params
    const {status,eventID,capacity}=req.body
    const response=await updateBooking(id,status,eventID,capacity)
    if(response.message==="Successful")
    {
        return res.send(response)
    }
    else if(response.message==="Seats not available")
    {
        return res.status(403).send(response)
    }
    else if(response.message==="Event has expired")
    {
        return res.status(403).send(response)
    }
    return res.status(401).send(response)
})

route.get("/mybookings",authMiddleware,async(req,res)=>{
    const {userID}=req.body
    const response=await getUserBookings(userID)
    if(response.message==="Successful")
    {
        return res.send(response)
    }
   return res.status(406).send(response) 
})
module.exports=route