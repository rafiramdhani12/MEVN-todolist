import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/create", async (req,res) => {
    try {
        const {name, username, password} = req.body;
        if(!name || !username || !password) {
            return res.status(400).send({error: "All fields are required"});
        }
        const user = await User.create({name, username, password});
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

export default router