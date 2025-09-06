"use client";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app, db } from "./firebase";
import { doc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export const initializeFirebaseMessaging = async (userId: string) => {
  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log("Firebase messaging skipped - not in browser environment");
      return;
    }

    // Check if Notification API is supported
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
      console.log("Service workers not supported");
      return;
    }

    const messaging = getMessaging(app);

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");

      // Get token
      const currentToken = await getToken(messaging, {
        vapidKey: "BNbOHtZfMzIoYwitbeOQWmacYCZ_6NSvniIHvC79BjDxBKfBCZv2Vhj3ZDKSc-D3EBOyDsgzNBW3Im51C3dqozI",
      });

      if (currentToken) {
        console.log("FCM Token:", currentToken);
        // Save the token to Firestore
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
          fcmTokens: arrayUnion(currentToken),
        });
        console.log("FCM token saved to user profile.");
      } else {
        console.log("No registration token available. Request permission to generate one.");
      }
    } else {
      console.log("Unable to get permission to notify.");
    }

    // Handle foreground messages
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // You can display a custom notification/toast here
      // For example, using the app's toast system
       new Notification(payload.notification?.title || 'Nueva Notificación', {
        body: payload.notification?.body,
        icon: payload.notification?.icon,
      });
    });

  } catch (error) {
    console.error("An error occurred while setting up notifications.", error);
    // Don't throw the error, just log it to prevent breaking the app
  }
};
