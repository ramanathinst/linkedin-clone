import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestionsConnections = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id).select("connections");

        const suggestedUser = await User.find({
            _id: {
                $ne: req.user._id,
                $nin: currentUser.connections
            }
        }).select("name username profilePicture headLine").limit(3);

        res.json(suggestedUser);

    } catch (error) {
        console.log("Error getting suggestions connections: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getPublicProfile = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (error) {
        console.log("Error getting public profile: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {

        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education"
        ];
        const updatedData = {};

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
            }
        }
        // todo check the profile img and banner img => uploaded to cloudinary

        if(req.body.profilePicture) {
            const result = await cloudinary.uploader.upload(req.body.profilePicture)
            updatedData.profilePicture = result.secure_url;
        }

        if(req.body.bannerImg) {    
            const result = await cloudinary.uploader.upload(req.body.bannerImg)
            updatedData.bannerImg = result.secure_url;  
        }

        const user = await User.findOneAndUpdate(
            req.user._id,
            { $set: updatedData },
            { new: true }
        ).select("-password");

        res.json(user);

    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
