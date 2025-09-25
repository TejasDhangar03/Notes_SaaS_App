import path from "path";
import express from "express";

import { fileURLToPath } from "url";

import user from "../models/users.js";
import genToken from "../Authentication/jwt.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/HTML/login.html"));
});

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await user.findOne({ email });

        if (!existingUser || existingUser.password != password) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        console.log(existingUser.toObject());
        const token = genToken(existingUser.toObject());
        res.cookie('JWT', token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(201).json({ message: "Login Successful", email: existingUser.email, plan: existingUser.plan, count: existingUser.count });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;