
import User from "./model.js";
import TryCatch from "./TryCatch.js";
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUsers =  TryCatch(async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please provide all required fields"
        });
    }
    let user = await User.findOne({email});
    if (user) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
        
    }
    const hashedPassword = await bycrypt.hash(password, 10);
    user = await User.create({
        name, 
        email, 
        password: hashedPassword, 
    });
    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET as string, {expiresIn: '1d'});
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
        }
        , token
    });












});