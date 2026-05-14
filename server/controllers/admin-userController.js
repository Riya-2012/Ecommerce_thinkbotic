const user = require('../models/user-model');

// *-------------------------
//     getAllUsers Logic 
// *-------------------------
const getAllUsers = async (req, res, next) => {
   try {
       const users = await user.find({}, { password: 0 });
       if (!users || users.length === 0) {
           return res.status(404).json({ msg: "No user found" });
       }
       return res.status(200).json(users);

   } catch (error) {
       next(error);
   }
}

// *-------------------------
//     get single Users Logic 
// *-------------------------
const getUserById = async (req,res,next) => {
    try {
        const id =req.params.id;
        const data = await user.findOne({_id:id}, { password: 0 });
        return res.status(200).json({msg: data});

    } catch (error) {
        next(error);   
    }
}

// *-------------------------
//     Update Users Logic 
// *-------------------------
const updateUserById = async (req,res,next) => {
    try {
        const id =req.params.id;
        const updateUserData = req.body;
        const updatedData = await user.updateOne({_id:id},{ $set: updateUserData });
        return res.status(200).json("User updated successfully");

    } catch (error) {
        next(error);   
    }
}

// *-------------------------
//     deleteAllUsers Logic 
// *-------------------------
const deleteUserById = async (req,res,next) => {
    try {
        const id =req.params.id;
        await user.deleteOne({_id:id});
        return res.status(200).json({msg:"User deleted successfully"});

    } catch (error) {
        next(error);   
    }
}

module.exports = { getAllUsers,deleteUserById,getUserById,updateUserById };