const express=require("express")
const { RegisterController } = require("../controllers/RegisterController")
const { LoginController } = require("../controllers/LoginController")

const userRouter=express.Router()

userRouter.post("/register",RegisterController)
userRouter.post("/login",LoginController)


module.exports={
    userRouter
}