// 🔥 Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCA7h1Mp3wvQsjxbIf_tIrp999Qa451sbM",
  authDomain: "hotel-pos-70dd1.firebaseapp.com",
  projectId: "hotel-pos-70dd1",
  storageBucket: "hotel-pos-70dd1.firebasestorage.app",
  messagingSenderId: "936336322021",
  appId: "1:936336322021:web:490e15ff996541f4f5530c"
};

// 🔥 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// 🔥 Firestore Database (Menu + Orders Store)
export const db = getFirestore(app);

// 🔥 Firebase Authentication (Login / Logout)
export const auth = getAuth(app);
