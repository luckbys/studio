// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCyMKe9bFCpwZcToRCrVQuLTeTXerP-qmM",
  authDomain: "webx-5ufg97.firebaseapp.com",
  projectId: "webx-5ufg97",
  storageBucket: "webx-5ufg97.appspot.com",
  messagingSenderId: "301770710898",
  appId: "1:301770710898:web:1e35e6c7c251d52a818c4c"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
