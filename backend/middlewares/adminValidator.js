const jwt=require("jsonwebtoken")
require("dotenv").config()
const adminValidator=async(req,res,next)=>{
    try{
        const token=req.headers.authorization;
        const decoded=jwt.verify(token,process.env.secretKey)
        if(decoded){
            if(decoded.role=="admin" || decoded.role=="superadmin"){
                next()
            }
            else{
                res.send({
                    message:"Operation not authorised,Please contact admin",
                    status:0,
                    error:true
                })
            }
        }
        else{
            res.send({
                message:"Invalid token , Please Login",
                status:2,
                error:true
            })
        }
            
    }catch(err){
        res.send({
            err,
            err:true,
            status:0
        })
    }
}

module.exports={
    adminValidator
}