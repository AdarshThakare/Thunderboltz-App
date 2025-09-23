import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDsvOuaJo2xbZHUDZhNTY9fe9yzT2uQ7zE",
  authDomain: "thunderboltz-app.firebaseapp.com",
  databaseURL: "https://thunderboltz-app-default-rtdb.firebaseio.com",
  projectId: "thunderboltz-app",
  storageBucket: "thunderboltz-app.firebasestorage.app",
  messagingSenderId: "303884092420",
  appId: "1:303884092420:web:23dd5e44c7bfa1dd562151",
  measurementId: "G-VGY6TLRCHK",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
