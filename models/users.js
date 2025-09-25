import db from "../Database/db.js";
import mongoose from "mongoose";

db();

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tenant_id: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: ['free', 'pro'],
        default: 'free'
    },
    count: {
        type: Number,
        default: 3,
    },

    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    }
});

const user = mongoose.model('user', userSchema);
export default user;