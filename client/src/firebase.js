import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore"; // Import initializeFirestore
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: "AIzaSyCKzm8qzOYwFjwVDf3_ur2t650UUK6iYV8",
    authDomain: "cofarm-7217f.firebaseapp.com",
    projectId: "cofarm-7217f",
    storageBucket: "cofarm-7217f.firebasestorage.app",
    messagingSenderId: "30419115423",
    appId: "1:30419115423:web:34f4cd8fc2b4e4529b71aa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore with settings to avoid some blocking issues
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true, // Force long polling to bypass some proxies/blockers
});

export const storage = getStorage(app);
export const functions = getFunctions(app);
export default app;
