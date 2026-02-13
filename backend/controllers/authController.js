const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  try {
    // debug: log incoming body to help diagnose 500 errors
    console.log("register body:", req.body);
    const { name, email, password } = req.body;

    // basic validation: return 400 if required fields missing
    if (!name || !email || !password) {
      console.warn("register: missing fields", { name, email, password });
      return res.status(400).json({ message: "Missing required fields" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("register error:", err);
    // In development, return error details to help debugging.
    if (process.env.NODE_ENV !== "production") {
      return res
        .status(500)
        .json({ message: err.message || "Server error", stack: err.stack });
    }
    res.status(500).json({ message: "Server error" });
  }
};
  //Login calling 
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
       if (!email || !password) {
        return res.status(400).json({ message: "Missing email or password" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User Not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      res.status(200).json({ message: "Login successful" });
    } catch (err) {
      console.error("login error:", err);
      res.status(500).json({ message: "Server error" });
    }
};
    //Get users data
    exports.getUsers = async (req, res) => {
      try{
        const users = await User.find().select("-password"); 
        // this -password uses to hide the password
        res.status(200).json(users);
      }catch(err){
        console.error("getUsers error:", err);
        res.status(500).json({ message: "Server error" });
      }
    
};

//UPDATE USER

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  }catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user 
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  }catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Image storing and retriving 

exports.uploadProfileImage = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { profileImage: req.file.path },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    console.error("uploadProfileImage error:", err);
    res.status(500).json({ message: "Image Upload failed" });
  }
};