const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: false, 
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    firstname: {
        type: String,
        default: "",
    },
    lastname: {
        type: String,   
        default: "",
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other"
    },
},{timestamps:true});

// *---------------------------
//      Hash Password
// *---------------------------
// userSchema.pre("save", async function (next) {
//     const user = this;

//     if (!user.isModified("password")) {
//         return next(); // fixed: added return
//     }

//     try {
//         const hashPassword = await bcrypt.hash(user.password, 10);
//         user.password = hashPassword;
//         next();
//     } catch (error) {
//         next(error);
//     }
// });

// *---------------------------
//      JSON WEB TOKEN
// *---------------------------
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                isAdmin: this.isAdmin,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const User = mongoose.model("User", userSchema);
module.exports = User;