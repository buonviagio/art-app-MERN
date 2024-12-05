import express from "express";

const testRouter = express.Router();

testRouter.get("/test", (request, response) => {
    response.send({
        message: "This is test from my jast created server",
        date: new Date()
    });
})

export default testRouter;