const { ProductModel } = require("../models/ProductModel");

const GetProductController=async()=>{
    try{
        const page=req.query.page || 0;
        const count=await ProductModel.find(req.query).countDocuments();
        const data=await ProductModel.find(req.query).skip(page*10).limit(10);
        res.send({
            message: "All products data",
            count:count,
            status: 1,
            data: data,
            error: false,
        });
    }catch(err){
        res.send({
            message: "Something went wrong: " + err.message,
            status: 0,
            err: true,
        });
    }
}

const GetsingleProduct=async(req,res)=>{
    try{
        let { id: _id } = req.params;
        let data = await ProductModel.find({ _id });
        res.send({
            message: "All products data",
            status: 1,
            data: data,
            error: false,
        });
    }catch(err){
        res.send({
            message: "Something went wrong: " + err.message,
            status: 0,
            err: true,
        });
    }
}


module.exports={
    GetProductController,
    GetsingleProduct
}