import db from "../Database/db.js";
import mongoose from "mongoose";

db();

const notesSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{           
        type:String,
        required:true,
    },
    tenant_id:{
        type:String,
        required:true,
    },
    user:{
        type:String,
        required:true,
    }
    
});

const notes=mongoose.model('Notes',notesSchema);
export default notes;