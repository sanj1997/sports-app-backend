const checkEventExpiry=(checkIsExpired)=>{
    // let details=checkIsExpired.timing.split("T")
    let eventDate=new Date(checkIsExpired.timing)
    let currentDate=new Date()
    if(currentDate>=eventDate)
    {
       return true
    }
    return false
}
module.exports=checkEventExpiry