import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_kerxTUe9sHxWQ4gXYjVFOZ-ZKzeErD0",
  authDomain: "study-path-generator-e7dcb.firebaseapp.com",
  projectId: "study-path-generator-e7dcb",
  storageBucket: "study-path-generator-e7dcb.firebasestorage.app",
  messagingSenderId: "380908536122",
  appId: "1:380908536122:web:8f424e41a54af35a915003",
  measurementId: "G-M7MRRT31YB",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);