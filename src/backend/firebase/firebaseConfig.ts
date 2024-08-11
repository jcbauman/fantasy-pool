// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC5Duc79NDuGp68I8IW3IC7FXPrm0bTYwI",
  authDomain: "rock-fantasy-pool.firebaseapp.com",
  projectId: "rock-fantasy-pool",
  storageBucket: "rock-fantasy-pool.appspot.com",
  messagingSenderId: "878659573592",
  appId: "1:878659573592:web:535e5653e2405a57ab372d",
  measurementId: "G-WVN3WYCNZQ",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth();
