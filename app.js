import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';

import router from './Routes/login.js';
import register from './Routes/register.js';
import admin from './Routes/admin.js';
import members from './Routes/members.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cookieParser());

app.use(cors({
    origin: "",
    credentials: true
}));

async function auth(req, res, next) {
    const token = req.cookies.JWT;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    // console.log(req.user);
    next();
}

function roleCheck(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: "forbidden" });
        }
        next();
    }
}

app.get('/health', auth, (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get('/', auth, (req, res) => {
    if (req.user.role === 'admin') {
        return res.redirect('/admin');
    }else{
        return res.redirect('/member');
    }
});

app.post("/logout", auth, (req, res) => {
    res.clearCookie("JWT", {
        httpOnly: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
});

app.use('/login', router);
app.use('/register', register);
app.use('/member',auth, members);
app.use('/admin', auth,roleCheck("admin"), admin)

// this is for vercel if you want to run locally then un comment following
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;