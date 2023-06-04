const express=require("express")
const {connection } = require("./db.js")
const colors=require("colors")
require("dotenv").config()
const cors=require("cors")
const { userRouter } = require("./routes/user.routes.js")
const { productRouter } = require("./routes/product.routes.js")
const { searchRouter } = require("./routes/search.routes.js")
const { authenticator } = require("./middlewares/authenticator.js")
const { statRouter } = require("./routes/stat.routes.js")
const { cartRouter } = require("./routes/cart.routes.js")
const { orderRouter } = require("./routes/order.routes.js")
const app=express()

app.use(express.json())
app.use(cors())

app.use("/search",searchRouter)
app.use("/user",userRouter)
app.use("/product",productRouter)

app.use(authenticator)
app.use("/stat",statRouter)
app.use("/cart",cartRouter)
app.use("/order",orderRouter)

app.listen(process.env.port,async()=>{
    try{
        await connection
        console.log(colors.yellow(`connected to DB and running at port ${process.env.port}`))
    }catch(err){
        console.log(colors.red("connection failed with DB"))
    }
})