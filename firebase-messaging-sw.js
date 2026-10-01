importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDAJvzM-a4_lb1PQA5aU_mWWFiaGqeaFrs",
  authDomain: "nfl-lock-of-the-week.firebaseapp.com",
  projectId: "nfl-lock-of-the-week",
  storageBucket: "nfl-lock-of-the-week.firebasestorage.app",
  messagingSenderId: "419047778900",
  appId: "1:419047778900:web:beda3e80f3e7b0412d1bc1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title =
    payload?.notification?.title ||
    payload?.data?.title ||
    "NFL - Lock of the Week";

  const body =
    payload?.notification?.body ||
    payload?.data?.body ||
    "You have a new Lock of the Week update.";

  self.registration.showNotification(title, {
    body,
    icon: "./favicon.ico",
    badge: "./favicon.ico",
    data: {
      url: payload?.data?.url || "./"
    }
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = new URL(
    event.notification?.data?.url || "./",
    self.location.origin
  ).href;

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true
      })
      .then((list) => {
        for (const client of list) {
          if (
            client.url.startsWith(self.location.origin) &&
            "focus" in client
          ) {
            client.navigate(target);
            return client.focus();
          }
        }

        return clients.openWindow
          ? clients.openWindow(target)
          : undefined;
      })
  );
});
