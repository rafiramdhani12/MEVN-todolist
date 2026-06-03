import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { name, username, password } = req.body;
        if (!name || !username || !password) {
            return res.status(400).send({ error: "All fields are required" });
        }
        const user = await User.create({ name, username, password });
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send({ error: "All fields are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).send({ error: "Invalid credentials" });
        }
        if (user.password !== password) {
            return res.status(401).send({ error: "Invalid credentials" });
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/logout", async (req, res) => {
    try {
        res.status(200).send({ message: "Logout successful" });
    } catch (error) {
        res.status(400).send(error);
    }
});

export default router;