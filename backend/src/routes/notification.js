const { Expo } = require('expo-server-sdk');
const expo = new Expo();

async function sendNotificationToUser(userId, title, body, data = {}) {
    const user = await User.findById(userId);
    if (!user || !user.pushTokens.length)
        return;

    // 2. Zapisz powiadomienie w historii (MongoDB) - aby było w aplikacji
    await Notification.create({
        userId,
        title,
        body,
        data,
        isRead: false
    });

    let messages = [];
    for (const token of user.pushTokens) {
        if (!Expo.isExpoPushToken(token))
            continue;

        messages.push({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: data, // Dane potrzebne do przekierowania po kliknięciu
            badge: 1, // Opcjonalnie: ustawia czerwoną jedynkę na ikonie
        });
    }

    let chunks = expo.chunkPushNotifications(messages);
    for (let chunk of chunks) {
        try {
            await expo.sendPushNotificationsAsync(chunk);
        } catch (error) {
            console.error(error);
        }
    }
}