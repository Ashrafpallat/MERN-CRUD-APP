import asyncHandler from "express-async-handler";
import generateToken from '../utils/generateToken.js'
import User from '../models/userModel.js'

// @desc Auth user/set token
// route POST /api/users/auth
// @accecc Public
const authUser = asyncHandler(async (req, res) => {
    console.log("authuser wrkd");
    try {  
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id)
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                image: user.image
            })
        } else {
            res.status(401).json('Invalid email or password')
            // throw new Error('Invalid email or password')
        }
    } catch (error) {
        console.log('auth user err', error);
    }

});

// @desc Register a new user
// route Post /api/users/users
// @access PUblic
const registerUser = asyncHandler(async (req, res) => {
    const { name, email,image, password } = req.body

    const userExists = await User.findOne({ email: email })
    if (userExists) {
        res.status(400)
        // throw new Error('User already exists')
        console.log('user already exists');
        return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({
        name,
        email,
        password
    })
    if (user) {
        console.log('user ', user);
        generateToken(res, user._id)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            image: user.image
        })
        console.log('generated');
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// @desc Logout user
// route PUT /api/users/logout
// @access Public
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: 'User logged out' })
})

// @desc GEt user profile
// route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }
    res.status(200).json(user)
})

// @desc Update user profile
// route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.image = req.body.image || user.image

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.status(200).json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                image: updatedUser.image,
            });
        } else {
            console.log('user not found');
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
};   