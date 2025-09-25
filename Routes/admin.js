import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer"
import { fileURLToPath } from "url";

import user from "../models/users.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const admin = express.Router();


async function sendMail(sendto) {
    nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_FROM, pass: process.env.GMAIL_API_KEY }
    }).sendMail({
        from: process.env.EMAIL_FROM,
        to: sendto,
        subject: "Invitation To Join Company",
        text: "Your are invited from company username will be ypur email and password will be your password"
    }, (err, info) => {
        if (err) console.log(err);
        else console.log("Sent:", info.response);
    });
    return 0;
}

admin.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../public/HTML/admin.html"));
});

admin.post('/invite', async (req, res) => {
    const users = new user(req.body)
    await users.save();
    sendMail(req.body.email);
    res.status(201).json({ message: "invite Successful" });
});

admin.get('/users', async (req, res) => {
    const data = await user.find({ tenant_id: req.user.tenant_id });
    res.status(200).json(data);
});

admin.put('/premium/:id', async (req, res) => {
    const uid = req.params.id;
    console.log(uid + "from req")
    const id = req.body.id;

    console.log("Update user with ID:", id);

    await user.findByIdAndUpdate(id, { plan: "pro" });
    res.status(200).json({ message: "User deleted successfully" });
});

export default admin;