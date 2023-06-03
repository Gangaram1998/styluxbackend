const jwt=require("jsonwebtoken")
require("dotenv").config()

const authenticator=async(req,res,next)=>{
    try{
        const token=req.headers.authorization
        const decoded=jwt.verify(token,process.env.secretKey)
        if(decoded.role==="deactivate"){
            res.send({
                message:"Your Account is deactivated  Conatact SuperAdmin",
                status:0,
                error:true
            })
        }
        next()
    }catch(err){
        console.log(err)
    }
}

module.exports={
    authenticator
}