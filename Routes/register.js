import path from "path";
import express from "express";
import bodyParser from "body-parser";

import {fileURLToPath}  from "url";
import user from "../models/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const register=express.Router();

register.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"../public/HTML/register.html"));
});

register.post('/',async(req,res)=>{
    const users=new user(req.body)
    await users.save();
    res.status(201).json({message:"Register Sucessfull Successful"});
});

export default register;