import 'firebase/analytics';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/messaging';

const getDataBaseUrl = () => {
    const host = window.location.host
    let url = "https://partner-bid-db.firebaseio.com/";
    if (host.includes('.ai')) {
        url = "https://partners-auction-bids.firebaseio.com/";
    } else if (host.includes('.live')) {
        url = "https://partner-bid-db-live.firebaseio.com/";
    } else if (host.includes('.site')) {
        url = "https://partner-bid-db-site.firebaseio.com/";
    } else if (host.includes('.tech')) {
        url = "https://partner-bid-db-tech.firebaseio.com/";
    }
    return url;
}


const initializedFirebaseApp = firebase.initializeApp({
    // Project Settings => Add Firebase to your web app
    apiKey: "AIzaSyDiAMxbjnY2Yn8gVQPWeRJlAI501j4DwjI",
    projectId: "notifications-259913",
    messagingSenderId: "991771490181",
    appId: "1:991771490181:web:6cf9ace58ee97302f636ec",
});

const messaging = firebase.messaging.isSupported() ? initializedFirebaseApp.messaging() : undefined;
messaging && messaging.usePublicVapidKey(
    // Project Settings => Cloud Messaging => Web Push certificates
    "BN_YGfO8X1nH3iVQLbNaGe-6f0B1AJ28VNLm8IWYgBubdE5N_BsK4DqQsx2ouEKqUz1cVv8bJNudEPvfzJuW8GU"
);


const askForPermissionToReceiveNotifications = async (messaging: any) => {

    if (firebase.messaging.isSupported() && 'serviceWorker' in navigator && 'PushManager' in window) {
        messaging.requestPermission().then(() => {
            return messaging.getToken();
        }).then((token: any) => {
            // console.log("FCM Token:", token);
            localStorage.setItem("token", token);

        }).catch((error: any) => {
            if (error.code === "messaging/permission-blocked") {
                console.log("Please Unblock Notification Request  Manually");
            } else {
                console.log("Error Occurred", error);
            }
        });
    }
}

const refreshToken = async (messaging: any) => {

    // if (firebase.messaging.isSupported() && 'serviceWorker' in navigator && 'PushManager' in window) {
    messaging.onTokenRefresh(function () {
        messaging.getToken()
            .then(function (refreshedToken: any) {
                console.log('Token refreshed.');
                localStorage.setItem("token", refreshedToken);
                return refreshToken;
            })
            .catch(function (err: any) {
                console.log('Unable to retrieve refreshed token ', err);
            });
    });
    // }
}

const registerServiceWorker = () => {
    if (isSupported() && "serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then(function (registration) {
                console.log("Registration successful, scope is:");
            })
            .catch(function (err) {
                console.log("Service worker registration failed, error:", err);
            });
    }
};


const unRegisterServiceWorker = () => {
    if (isSupported() && "serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
            for (let registration of registrations) {
                registration.unregister();
            }
        }).catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
    }
};

const isSupported = (): boolean => firebase.messaging.isSupported();

const auctionDb = initializedFirebaseApp.database(getDataBaseUrl());


export {
    messaging,
    isSupported,
    registerServiceWorker,
    askForPermissionToReceiveNotifications,
    refreshToken,
    unRegisterServiceWorker,
    initializedFirebaseApp,
    getDataBaseUrl,
    auctionDb,
};

