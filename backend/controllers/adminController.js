import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler'

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && user.isAdmin && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(401).json('Invalid email or password');
    }
  } catch (error) {
    res.status(500).json('Server error');
    console.log(error);
  }
};

const loadUser = asyncHandler(async (req, res) => {
  const users = await User.find({ isAdmin: { $ne: true } });

  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export {
  adminLogin,
  loadUser,
  deleteUser,
}

