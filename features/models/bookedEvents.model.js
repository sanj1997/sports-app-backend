const {Schema,model}=require("mongoose")

const BookedEventsSchema=new Schema({
    eventID:{type:Schema.Types.ObjectId,ref:"event"},
    organizerID:{type:Schema.Types.ObjectId,ref:"user"},
    createdByID:{type:Schema.Types.ObjectId,ref:"user"},
    status:{type:String,default:"Pending"}
})

const BookedEventsModel=model("booking",BookedEventsSchema)
module.exports=BookedEventsModel