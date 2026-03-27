import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAozWd6RPZliDh7CDIDEFcKHzCc4CBzumo",
  authDomain: "almaris-5c102.firebaseapp.com",
  projectId: "almaris-5c102",
  storageBucket: "almaris-5c102.firebasestorage.app",
  messagingSenderId: "564283974646",
  appId: "1:564283974646:web:c5ab82c637120c658a9dd7",
  measurementId: "G-PHN33BN180"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
