import express from "express";
import path from "path";
import dotenv from "dotenv";

import { Resend } from "resend";
import { fileURLToPath } from "url";

import notes from "../models/notes.js";
import user from "../models/users.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const members = express.Router();


members.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname, "../public/HTML/members.html"));
});

members.post("/create", async (req, res) => {

    const { content, title } = req.body;
    const { tenant_id, email } = req.user;
    let plan, count;
    try {
        const result = await user.findOne({
            email: email,
            tenant_id: tenant_id
        })

        plan = result.plan
        count = result.count;
        console.log(result)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: "Internal Server Error" });
    }

    const obj = {
        content,
        title,
        tenant_id,
        user: email
    };

    // console.log(plan);

    if (count > 0 && plan == "free") {
        try {
            const newNote = new notes(obj);
            await newNote.save();
            count = count - 1;
            const result = await user.findOneAndUpdate({
                email: email,
                tenant_id: tenant_id
            }, { $set: { count: count } })
            return res.status(200).json({ message: "Note Created Successfully", data: count });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error", data: count });
        }
    }
    else if (plan == "pro") {
        try {
            const newNote = new notes(obj);
            await newNote.save();

            count = count - 1;
            const result = await user.findOneAndUpdate({
                email: email,
                tenant_id: tenant_id
            }, { $set: { count: count } })

            return res.status(200).json({ message: "Note Created Successfully", data: count });
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({ message: "Internal Server Error", data: count });
        }
    }
    else if (plan == "free" && count == 0) {
        return res.status(500).json({ message: "Plan expired contact to admin for upgrade then login again" });
    }
});

members.get("/notes", async (req, res) => {
    const { tenant_id } = req.user;
    try {
        const allNotes = await notes.find({ tenant_id });
        return res.status(201).json({ message: "Notes fetched successfully", data: allNotes });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

members.delete("/remove/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await notes.findByIdAndDelete(id)
        console.log("deleted")
        res.status(201).json({ message: "Dateted Successfull", data: result })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "INternal Server Error" })
    }
})

members.put("/update/:id", async (req, res) => {

    const id = req.params.id
    const body = req.body;
    // console.log(body)

    try {
        const result = await notes.findByIdAndUpdate(id, { title: body.title, content: body.content })
        console.log("data Updated " + body.id)
        res.status(201).json({ message: "Updated data" });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

export default members;