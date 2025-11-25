import { Expo } from "expo-server-sdk";
import User from "./model/User.js";
import Notification from "./model/Notification.js";

const expo = new Expo();

//  WYSYŁANIE POWIADOMIENIA
export async function sendNotification(userID, title, body, data = {}) {
    const user = await User.findById(userID);
    if (!user || !user.pushTokens || user.pushTokens.length === 0) {
        console.log(`Użytkownik ${userID} nie ma tokenów push.`);
        return;
    }

    console.log(`Sending a new notification message (to ${userID}):`, title, data);

    // Zapis do historii
    await Notification.create({
        userID,
        title,
        body,
        data,
        isRead: false
    });

    const messages = [];

    for (const token of user.pushTokens) {
        if (!Expo.isExpoPushToken(token))
            continue;

        messages.push({
            to: token,
            sound: "default",
            title,
            body,
            data,
            badge: 1,
            channelId: "default"
        });
    }

    const chunks = expo.chunkPushNotifications(messages);

    for (let chunk of chunks) {
        try {
            const receipts = await expo.sendPushNotificationsAsync(chunk);
            console.log("🧾 Expo odpowiedziało:", JSON.stringify(receipts, null, 2));
            handleReceipts(receipts, userID);
        }
        catch (err) {
            console.error("Expo push error:", err);
        }
    }
}


//  OBSŁUGA RECEIPTS (martwe tokeny)
async function handleReceipts(receipts, userID) {
    const failedTokens = [];

    for (let receipt of receipts) {
        if (receipt.status === "error" && receipt.details && receipt.details.error === "DeviceNotRegistered")
            failedTokens.push(receipt.to);
    }

    if (failedTokens.length > 0) {
        await User.findByIdAndUpdate(
            userID,
            { $pull: { pushTokens: { $in: failedTokens } } }
        );
    }
}