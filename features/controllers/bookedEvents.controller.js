const BookedEventsModel = require("../models/bookedEvents.model")
const EventsModel = require("../models/events.model")
const checkEventExpiry=require("../utils/helperFunctions")
const createBooking=async(data)=>{
    const {eventID,createdByID}=data
     let response
     try{
         
         const eventDetails=await EventsModel.findOne({_id:eventID})
         const result=checkEventExpiry(eventDetails)
         if(result)
         {
            response={message:"Event has expired"}
         }
         else if(eventDetails.capacity<=0)
         {
            response={message:"Seats not available"}
         }
         else
         {
            const checkIsExisting=await BookedEventsModel.findOne({eventID:eventID,createdByID:createdByID})
            if(checkIsExisting)
            {
               response={message:"You have already booked this event"}
            }
            else
            {
               const newBooking=await BookedEventsModel.create(data)
               response={message:"Successful"}
            }
         }
     }catch(e){
        response={message:e.message}
     }
   return response  
}

const getBookings=async(id)=>{
    let response
    try{
        const allBookings=await BookedEventsModel.find({organizerID:id}).populate("eventID").populate("createdByID")
        const data=[]
        for(let i=0;i<allBookings.length;i++)
        {
            const result=checkEventExpiry(allBookings[i].eventID)
            if(result)
            {
                const updateEvent=await BookedEventsModel.updateOne({_id:allBookings[i]._id},{$set:{status:"Expired"}})
            }
        }
        for(let i=0;i<allBookings.length;i++)
        {
            const details=allBookings[i].eventID.timing.split("T")
            let payload={
                createdBy:allBookings[i].createdByID.name,
                eventName:allBookings[i].eventID.name,
                place:allBookings[i].eventID.place,
                date:details[0],
                time:details[1],
                status:allBookings[i].status,
                capacity:allBookings[i].eventID.capacity,
                eventID:allBookings[i].eventID._id,
                category:allBookings[i].eventID.category,
                _id:allBookings[i]._id
            }
            data.push(payload)
        }
        response={message:"Successful",data:data}
    }catch(e){
        response={message:e.message}
    }
    return response
}

const updateBooking=async(id,status,eventID,capacity)=>{
    let response
    try{
        const booking=await BookedEventsModel.findOne({_id:id}).populate("eventID")
        if(booking.status==="Expired")
        {
            response={message:"Event has expired"}
        }
        else if(booking.eventID.capacity<=0&&status=="Accept")
        {
            response={message:"Seats not available"}
        }
        else
        {
            const updatedBooking=await BookedEventsModel.updateOne({_id:id},{$set:{status:status}})
            if(status==="Accept"&&booking.status==="Pending")
            {
                const event=await EventsModel.updateOne({_id:eventID},{$set:{capacity:capacity-1}})
            }
            else if(status==="Reject"&&booking.status==="Accept")
            {
                const event=await EventsModel.updateOne({_id:eventID},{$set:{capacity:capacity+1}})
            }
            else if(status==="Accept"&&booking.status==="Reject")
            {
                const event=await EventsModel.updateOne({_id:eventID},{$set:{capacity:capacity-1}})
            }
            response={message:"Successful"}
        }
        
    }catch(e){
        response={message:e.message}
    }
    return response
}

const getUserBookings=async(id)=>{
    let response
    try{
        const myBookings=await BookedEventsModel.find({createdByID:id}).populate("eventID")
        let data=[]
        if(myBookings.length>=1)
        {
            for(let i=0;i<myBookings.length;i++)
            {
                  let attendees=[]
                  const eventID=myBookings[i].eventID
                  const eventDetails=await EventsModel.findOne({_id:eventID})
                  if(myBookings[i].status=="Accept")
                  {
                     const attendeesBookings=await BookedEventsModel.find({eventID:eventID}).populate("createdByID")
                     for(let i=0;i<attendeesBookings.length;i++)
                     {
                        attendees.push(attendeesBookings[i].createdByID.name)
                     }
                  }
                  const details=eventDetails.timing.split("T")
                  let payload={
                    name:eventDetails.name,
                    place:eventDetails.place,
                    capacity:eventDetails.capacity,
                    category:eventDetails.category,
                    date:details[0],
                    time:details[1],
                    attendees:attendees,
                    _id:eventDetails._id,
                    status:myBookings[i].status
                  }
                  data.push(payload)
            }
        }
        response={message:"Successful",data:data}
    }catch(e){
          response={message:e.message}
    }
    return response
}


module.exports={createBooking,getBookings,updateBooking,getUserBookings}