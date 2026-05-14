const Navbar = require('../models/navbar-model');
const path = require('path');
const fs = require('fs');

const getAllNavbars = async (req, res, next) => {
    try {
        // Initialize Navbars before using it
        let Navbars = await Navbar.find({});
        if (!Navbars || Navbars.length === 0) {
            return res.status(404).json({ msg: "No navbar items found" });
        }
        return res.status(200).json({ Navbars });
    } catch (error) {
        next(error);
    }
};





const addLogo = async (req, res) => {
    const { label, path } = req.body;
    let logo = '';
    if (req.file) {
        logo = req.file.filename;
    }

    const newLogo = new Navbar({ label, path, logo });

    try {
        const savedLogo = await newLogo.save();
        res.status(201).json(savedLogo);
    } catch (error) {
        console.error("Error saving logo:", error);
        res.status(400).json({ message: error.message });
    }
};

const updateLogoById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;

        if (req.file) {
            updatedData.logo = req.file.filename;
        }

        const updateLogo = await Navbar.findByIdAndUpdate(id, { $set: updatedData }, { new: true });
        return res.status(200).json({ msg: "Logo updated successfully", updateLogo });
    } catch (error) {
        next(error);
    }
};

const deleteLogoById = async (req, res, next) => {
    try {
        const id = req.params.id;
        await Navbar.deleteOne({ _id: id });
        return res.status(200).json({ msg: "Logo deleted successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllNavbars, addLogo, deleteLogoById, updateLogoById };