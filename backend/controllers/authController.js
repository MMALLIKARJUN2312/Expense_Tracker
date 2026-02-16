import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : "7d"
    })
}

// Registering a user
export const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        // Check if user exists
        const userExists = await User.findOne({email});

        if (userExists) {
            return res.status(400).json({message : "User already exists"})
        }

        const user = await User.create({
            name, 
            email,
            password
        });

        res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    } catch (error) {
        console.error("REGISTER ERROR:", error);
        res.status(500).json({message : "Internal Server Error"});
    }
}

// Login for a user
export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({message : "Invalid Credentials"});
        }

        res.status(200).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            token : generateToken(user._id)
        })
    } catch (error) {
        console.error("LOGIN ERROR:", error);
        res.status(500).json({message : "Internal Server Error"});
    }
}