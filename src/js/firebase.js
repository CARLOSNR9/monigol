// src/js/firebase.js

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration (provided by the client)
const firebaseConfig = {
  apiKey: "AIzaSyCazA7lGR3B9c83nd1T8FySN6gtw_AhW3U",
  authDomain: "monigol-f385e.firebaseapp.com",
  projectId: "monigol-f385e",
  storageBucket: "monigol-f385e.firebasestorage.app",
  messagingSenderId: "786564647117",
  appId: "1:786564647117:web:236f245ce3f85770060184"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// You can now import { auth, db } from "./firebase.js" in other modules
