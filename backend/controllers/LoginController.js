const { comparePassword } = require("../helper/Passwordhelper");
const { UserModel } = require("../models/userModel");
const jwt=require("jsonwebtoken")
require("dotenv").config()

const LoginController=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await UserModel.findOne({email})
        if(!user){
            res.send({
                err:true,
                status:0,
                message:"User not found!, Please Signup"
            })
        }
        const match=await comparePassword(password,user.password)
        if(!match){
            res.send({
                message:"Incorrect Password",
                status:0
            })
        }
        const token=jwt.sign({userId:user._id,role:user.role},process.env.secretKey)
        res.send({
            message:"Login Successful!!",
            err:false,
            status:1,
            token:token
        })
    }catch(err){
        res.send({
            err:true,
            err:err.message,
            status:0
        })
    }
}
module.exports={
    LoginController
}