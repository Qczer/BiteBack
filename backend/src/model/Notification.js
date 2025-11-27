import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    translationKey: { type: String, required: true },
    translationArgs: { type: Object, default: {} },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Object, default: {} },
    isRead: { type: Boolean, default: false },
}, { timestamps: true }); // timestamps - Dodaje createdAt i updatedAd

const Notification = mongoose.model("Notification", NotificationSchema)
export default Notification