import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDEgAJ00rCxBbwkjzk4McoWaLIfosv9DOk",
  authDomain: "chess-app-34f1a.firebaseapp.com",
  projectId: "chess-app-34f1a",
  storageBucket: "chess-app-34f1a.appspot.com",
  messagingSenderId: "210696268463",
  appId: "1:210696268463:web:c06c71ff7e9b619a7b425a",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider };
