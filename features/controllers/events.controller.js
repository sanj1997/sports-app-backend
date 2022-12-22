const EventsModel = require("../models/events.model")


const createEvent=async(name,description,timing,place,capacity,userId,category)=>{
    let response
    try{
        const newEvent=await EventsModel.create({name,description,timing,place,capacity,userId,category})
        response={message:"Successful"}
    }catch(e){
        response={message:e.message}
    }
    return response
}
const getAllEvents=async(filter,query)=>{
    let response;
    try{
         let allEvents;
         if(filter==="Any"&&query==="")
         {
            allEvents=await EventsModel.find().populate("userId")
         }
         else if(filter!="Any"&&query==="")
         {
            allEvents=await EventsModel.find({category:filter}).populate("userId")
         }
         else if(query!=""&&filter==="Any")
         {
            allEvents=await EventsModel.find({name:{$regex:query,$options:"i"}}).populate("userId")
         }
         else if(query!=""&&filter!="Any")
         {
            allEvents=await EventsModel.find({name:{$regex:query,$options:"i"},category:filter}).populate("userId")
         }
         const data=[]
         for(let i=0;i<allEvents.length;i++)
         {
            let payload={
                name:allEvents[i].name,
                place:allEvents[i].place,
                timing:allEvents[i].timing,
                capacity:allEvents[i].capacity,
                organizer:allEvents[i].userId.name,
                category:allEvents[i].category,
                _id:allEvents[i]._id
            }
            data.push(payload)
         }
         response={message:"Successful",data:data}
    }catch(e){
        response={message:e.message}
    }
    return response
}

const getSingleEvent=async(id)=>{
    let response;
     try{
          
          const singleEvent=await EventsModel.findOne({_id:id}).populate("userId")
          const details=singleEvent.timing.split("T")
          const date=details[0]
          const time=details[1]
          const data={
            name:singleEvent.name,
            place:singleEvent.place,
            date:date,
            time:time,
            capacity:singleEvent.capacity,
            description:singleEvent.description,
            eventID:singleEvent._id,
            organizerID:singleEvent.userId._id,
            category:singleEvent.category,
            organizer:singleEvent.userId.name
          }
          response={message:"Successful",data:data}
     }catch(e){
          response={message:e.message}
     }
    return response 
}
module.exports={createEvent,getAllEvents,getSingleEvent}