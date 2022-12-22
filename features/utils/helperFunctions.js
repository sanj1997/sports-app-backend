const checkEventExpiry=(checkIsExpired)=>{
    let details=checkIsExpired.timing.split("T")
    let eventDate=new Date(details[0]+" "+details[1])
    let currentDate=new Date()
    if(currentDate>=eventDate)
    {
       return true
    }
    return false
}
module.exports=checkEventExpiry