import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// src/firebase.js
const firebaseConfig = {
  apiKey: "AIzaSyD9v3AazezWslwrp0fIA7TzrHS-amGJS_I",
  authDomain: "hackathon-original-5f4f3.firebaseapp.com",
  projectId: "hackathon-original-5f4f3",
  storageBucket: "hackathon-original-5f4f3.appspot.com",
  messagingSenderId: "735394732716",
  appId: "1:735394732716:web:6da8108ee287e808c75d09",
  measurementId: "G-J8ENC8Z467"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
