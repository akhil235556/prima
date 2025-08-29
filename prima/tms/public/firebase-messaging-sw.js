importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.14.2/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDiAMxbjnY2Yn8gVQPWeRJlAI501j4DwjI",
    projectId: "notifications-259913",
    messagingSenderId: "991771490181",
    appId: "1:991771490181:web:6cf9ace58ee97302f636ec"
});

const firebaseMessaging = firebase.messaging();
firebaseMessaging.setBackgroundMessageHandler(payload => {
    const title = "";
    return self.registration.showNotification(title, payload.notification);
});
