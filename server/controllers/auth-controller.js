const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("../firebaseAdmin");


// *---------------------------
//      Home Logic
// *---------------------------

const home = async (req, res) => {
    try {
        res.status(200).send("Welcome to Home Page")
    }
    catch (error) {
        console.log(error)
    }
}

// *---------------------------
//      signUp Logic
// *---------------------------
const signUp = async (req, res, next) => {
    console.log("Received body................:", req.body);
    try {
        let { username, firstname, lastname, gender, email, phone } = req.body;

        // Ensure phone is in E.164 format (with +91)
        if (!phone.startsWith("+91")) {
            phone = "+91" + phone.replace(/^0+/, ""); // remove leading 0s if any
        }
        const userExist = await User.findOne({ $or: [{ email }, { phone }] });

        if (userExist) {
            let msg = userExist.email === email
                ? "Email already exists"
                : "Phone already exists";
            return res.status(400).json({ msg });
        }
        const newUser = await User.create({ username, firstname, lastname, gender, email, phone });
 const token = await newUser.generateToken();
    res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,

});
        res.status(201).json({
            msg: "Registration successful",
            token: token,
            userId: newUser._id.toString(),
        });
    } catch (error) {
        res.status(500).json({ msg: "Something broke!", error: error.message });
    }
}

// *---------------------------
// Verify OTP login Logic (if storing OTP in DB or cache)
// *---------------------------

// const verifyOtp = async (req, res) => {

//   try {
//     const { idToken } = req.body;

//     // Verify idToken with Firebase Admin
//     const decodedToken = await admin.auth().verifyIdToken(idToken);
//     console.log("Decoded Firebase token:", decodedToken); // Debug log

//     // Support both phone_number and phoneNumber
//     const phoneNumber = decodedToken.phone_number || decodedToken.phoneNumber;
//     if (!phoneNumber) {
//       return res.status(400).json({ msg: "Phone number not found in token." });
//     }

//     // Find or create user
//     let user = await User.findOne({ phone: phoneNumber });
//     if (!user) {
//       user = await User.create({
//         username: phoneNumber,
//         phone: phoneNumber,
//       });
//     }

//     const token = await user.generateToken();
//     return res.status(200).json({
//       msg: "Login successful",
//       token,
//       userId: user._id.toString(),
//     });
//   } catch (error) {
//     console.error("OTP verify error:", error);
//     return res.status(401).json({ msg: "OTP verification failed", error: error.message });
//   }
// };

const verifyOtp = async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify idToken with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log("Decoded Firebase token:", decodedToken);

    const phoneNumber = decodedToken.phone_number || decodedToken.phoneNumber;
    if (!phoneNumber) {
      return res.status(400).json({ msg: "Phone number not found in token." });
    }

    // Find user by phone
    let user = await User.findOne({ phone: phoneNumber });
    if (user) {
      // User exists, generate JWT and return user data
      const token = await user.generateToken();
    res.cookie("token", token, {
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 1000,

});

      
      return res.status(200).json({
        msg: "Login successful",
        token,
        userId: user._id.toString(),
        userData: user,
      });
      
    } else {
      // User does not exist, ask frontend to redirect to signup

      return res.status(202).json({
        msg: "User not found. Please sign up.",
        redirect: "/signup",
        phone: phoneNumber,
      });
    }
  } catch (error) {
    console.error("OTP verify error:", error);
    return res.status(401).json({ msg: "OTP verification failed", error: error.message });
  }
};

// *-------------------
// to send user data - User Logic
// *-------------------

const user = async (req, res) => {
    try {
        const userData = req.user;
        console.log(userData);
        return res.status(200).json({ userData });
    } catch (error) {
        console.log(` error from user route ${error}`);
    }
};

const updateUserById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updateUserData = req.body;
        const updatedData = await User.findByIdAndUpdate(id, updateUserData, { new: true });
        return res.status(200).json(updatedData);
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res) => {
    try{
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
        });
        res.status(200).json({ msg: "Logout successful" });
    }
    catch(error){
        console.log(error);
    }
}

module.exports = { home, signUp, verifyOtp, user, updateUserById,logout };