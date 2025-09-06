// Simple service worker for Firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyD6JnK3wAMmSUgJoaiYORVFIhX0mXAmLyI",
  authDomain: "banda-b4fc5.firebaseapp.com",
  projectId: "banda-b4fc5",
  storageBucket: "banda-b4fc5.appspot.com",
  messagingSenderId: "71298040897",
  appId: "1:71298040897:web:e3ac815f127a37df4572c0",
  measurementId: "G-KWMV6PNDFT"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});