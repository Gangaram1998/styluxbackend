const { hashPassword } = require("../helper/Passwordhelper")
const { UserModel } = require("../models/userModel")

const RegisterController=async(req,res)=>{
    try{
        const {name,email,password,role,phone}=req.body
        const existingemail=await UserModel.findOne({email})
        const existingphone=await UserModel.findOne({phone})
        if(existingemail || existingphone){
            res.send({
                message:"User is already registered",
                err:false,
                status:0
            })
        }
        const hashedPassword=await hashPassword(password)
        const user=new UserModel({name,email,password:hashedPassword,role,phone})
        await user.save()
        res.send({
            err:false,
            status:1,
            message:"User registered successfully."
        })
    }catch(err){
        res.send({
            err:true,
            status:0,
            err:err.message
        })
    }
}


module.exports={
    RegisterController
}