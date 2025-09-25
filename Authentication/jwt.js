import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const genToken = (payload) => {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
    // console.log(token);
    return token;
}

export default genToken;