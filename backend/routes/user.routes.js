const express=require("express")
const { RegisterController } = require("../controllers/RegisterController")
const { LoginController } = require("../controllers/LoginController")
const { superAdminValidator } = require("../middlewares/superAdminValidator")
const { authenticator } = require("../middlewares/authenticator")
const { UserModel } = require("../models/userModel")
const { ProductModel } = require("../models/ProductModel")
const { CartModel } = require("../models/CartModel")
const { OrderModel } = require("../models/OrderModel")

const userRouter=express.Router()

userRouter.post("/register",RegisterController)
userRouter.post("/login",LoginController)


userRouter.patch("/superadmin/:id", superAdminValidator, async (req, res) => {
    const { id } = req.params;
    const {userId} = req.headers
    const {role} = req.body
    if(role=="delete"){
      try {
        await UserModel.deleteOne({email:id})
        await ProductModel.deleteMany({adminId:"admin"+userId})
        await CartModel.deleteMany({adminId:"admin"+userId})
        await OrderModel.deleteMany({adminId:"admin"+userId})
        res.send({
          message:"User deleted",
          status:1,
          error:false
        })
      } catch (error) {
        res.send({
          message:"User deletetion failed",
          status:0,
          error:true
        })
      }
    }else{
      try {
        await UserModel.updateOne({ email: id }, req.body);
        res.send({
          message: "Role changed",
          status: 1,
          error: false,
        });
      } catch (error) {
        res.send({
          message: "Something went wrong: " + error.message,
          status: 0,
          error: true,
        });
      }
    }
    
  });
  
  userRouter.get("/getuser",authenticator,async(req,res)=>{
    let token = req.headers.authorization
    jwt.verify(token,process.env.SecretKey,async(err,decoded)=>{
  
      if(err) res.send({
        message:"Invalid token",
        status:0,
        error:true
      })
  
      if(decoded){
        let {userId,role}=decoded
        try {
          if(role=="admin"||role=="superadmin"){
            let data = await UserModel.find({_id:userId})
            res.send({
              message:"Admin panel approved",
              role:role,
              userId:userId,
              name:data[0].name,
              status:1,
              error:false
            })
          }else{
            res.send({
              message:"Restricted Area",
              status:0,
              error:true
            })
          }        
        } catch (error) {
          res.send({
            message:"Something went wrong: "+error.message,
            status:0,
            error:true
          })
          
        }
  
      }else{
        res.send({
          message:"Invalid token",
          status:0,
          error:true
        })
      }
  
    })
   
  })
  
  
  userRouter.get("/admin", async (req, res) => {
    let {role} = req.headers
    let page = req.query.page||0
  
  
    try {
      let count  = await UserModel.find({ role}).countDocuments()
      let data = await UserModel.find({ role}).skip(page*5).limit(5);
      res.send({
        message: "All users data",
        status: 1,
        data: data,
        count:count,
        error: false,
      });
    } catch (error) {
      res.send({
        message: "Something went wrong" + error.message,
        status: 0,
        error: true,
      });
    }
  });


module.exports={
    userRouter
}