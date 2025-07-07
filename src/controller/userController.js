const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

exports.createUser = async (req, res) => {
  try {
    const { firstname, lastname, username, email, phone, password, role } =
      req.body;
    const hashedpassword = await bcrypt.hash(password, 11);
    console.log(hashedpassword);
    const newUser = new User({
      firstname,
      lastname,
      username,
      email,
      phone,
      password: hashedpassword,
      role,
    });
    console.log(newUser);
    await newUser.save();
    res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log("Login attempt with email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "user doesn't exsist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    console.log("hai");
    const token = jwt.sign(
      { id: user._id, username: user.username, usertype: user.role },
      process.env.JWT_SECRET
    );
    console.log(token);
    req.session.token = token;
    res
      .status(200)
      .json({ message: "Login successful", useremail: user.email, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Logout route
exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
