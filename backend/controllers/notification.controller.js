import Notification from "../models/notification.model.js";

export const getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 })
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image");

        res.status(200).json(notifications);
    } catch (error) {
        console.log("Error getting user notifications: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const markNotificationAsRead = async (req, res) => {
    const notificationId = req.params.id;

    try {
        const notification = await Notification.findByIdAndUpdate({
            _id: notificationId,
            recipient: req.user._id,
        }, { read: true }, { new: true });

        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json(notification);
    } catch (error) {
        console.log("Error marking notification as read: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteNotification = async (req, res) => {
    const notificationId = req.params.id;

    try {
        const notification = await Notification.findByIdAndDelete({
            _id: notificationId,
            recipient: req.user._id,
        });

        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.log("Error deleting notification: ", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}