const express=require("express")
const {connection } = require("./db.js")
const colors=require("colors")
require("dotenv").config()
const cors=require("cors")
const { userRouter } = require("./routes/user.routes.js")
const app=express()

app.use(express.json())
app.use(cors())

app.use("/user",userRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(colors.yellow(`connected to DB and running at port ${process.env.port}`))
    }catch(err){
        console.log(colors.red("connection failed with DB"))
    }
})