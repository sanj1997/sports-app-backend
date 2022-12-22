const {Schema,model}=require("mongoose")

const EventsSchema=new Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    timing:{type:String,required:true},
    place:{type:String,required:true},
    capacity:{type:Number,required:true},
    userId:{type:Schema.Types.ObjectId,ref:"user"},
    category:{type:String,enum:["Cricket","Football","Badminton","Swimming","Hockey","Kabaddi","Any"],required:true}
})

const EventsModel=model("event",EventsSchema)
module.exports=EventsModel