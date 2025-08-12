// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "waterplant-pro",
  appId: "1:1014466108031:web:5e60dba99dc6db76e5bd4a",
  storageBucket: "waterplant-pro.firebasestorage.app",
  apiKey: "AIzaSyCtEvQBr-_bSyKxn0pslpE5F5-snsn4kuY",
  authDomain: "waterplant-pro.firebaseapp.com",
  messagingSenderId: "1014466108031",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
