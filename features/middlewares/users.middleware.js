require("dotenv").config()
const jwt=require("jsonwebtoken")

const authMiddleware=(req,res,next)=>{
   const accessToken=req.headers.authorization
   if(accessToken)
   {
      try{
        let userData=jwt.verify(accessToken,process.env.ACCESS_TOKEN_PASSWORD)
        req.body.userID=userData.id
        next()
      }catch(e)
      {
         return res.status(401).send({message:e.message})
      }
   }
   else
   {
      return res.status(401).send({message:"Unauthorized access"})
   }
}

module.exports=authMiddleware