    const express = require("express");
    const jwt = require("jsonwebtoken");
    require("dotenv").config();
    const {
    GetProductController,
    GetsingleProduct,
    } = require("../controllers/productControllers");
    const { authenticator } = require("../middlewares/authenticator");
    const { ProductModel } = require("../models/ProductModel");
    const { adminValidator } = require("../middlewares/adminValidator");
    const productRouter = express.Router();

    productRouter.get("/", GetProductController);
    productRouter.get("/:id", GetsingleProduct);
    productRouter.use(authenticator);
    productRouter.post("/", async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.secretKey);
        if (decoded) {
        req.body.forEach((el) => {
            el.adminId = "admin" + decoded.userId;
        });
        await ProductModel.insertMany(req.body);
        res.send({
            message: "Product added",
            status: 1,
            error: false,
        });
        } else {
        res.send({
            message: "Something went wrong: " + error.message,
            status: 0,
            error: true,
        });
        }
    } catch (err) {
        res.send({
        message: "Something went wrong: " + err,
        status: 0,
        error: true,
        });
    }
    });

    productRouter.use(adminValidator);

    productRouter.patch("/:id", async (req, res) => {
    let { id: _id } = req.params;

    try {
        await ProductModel.findByIdAndUpdate({ _id }, req.body);
        res.send({
        message: "Product updated",
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
    });

    productRouter.delete("/:id", async (req, res) => {
    let { id: _id } = req.params;

    try {
        await ProductModel.findByIdAndDelete({ _id });
        res.send({
        message: "Product deleted",
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
    });

    productRouter.post("/admin", async (req, res) => {
    const token = req.headers.authorization;
    const page = req.query.page;

    jwt.verify(token, process.env.SecretKey, async (err, decoded) => {
        if (err)
        res.send({
            message: "Invalid token: " + err,
            status: 0,
            error: true,
        });

        if (decoded) {
        if (decoded.role == "admin") {
            try {
            let count = await ProductModel.find({
                adminId: "admin" + decoded.userId,
                ...req.query,
            }).countDocuments();
            let data = await ProductModel.find({
                adminId: "admin" + decoded.userId,
                ...req.query,
            })
                .skip(page * 5)
                .limit(5);
            res.send({
                message: "All products data",
                status: 1,
                data: data,
                error: false,
                count: count,
            });
            } catch (error) {
            res.send({
                message: "Something went wrong: " + error.message,
                status: 0,
                error: true,
            });
            }
        } else {
            try {
            let count = await ProductModel.find({
                ...req.query,
            }).countDocuments();
            let data = await ProductModel.find({ ...req.query })
                .skip(page * 5)
                .limit(5);
            res.send({
                message: "All products data",
                status: 1,
                data: data,
                count: count,
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
        } else {
        res.send({
            message: "Invalid token:",
            status: 0,
            error: true,
        });
        }
    });
    });

    module.exports = {
    productRouter,
    };
