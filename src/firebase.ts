import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAozWd6RPZliDh7CDIDEFcKHzCc4CBzumo",
  authDomain: "almaris-5c102.firebaseapp.com",
  projectId: "almaris-5c102",
  storageBucket: "almaris-5c102.firebasestorage.app",
  messagingSenderId: "564283974646",
  appId: "1:564283974646:web:c5ab82c637120c658a9dd7",
  measurementId: "G-PHN33BN180"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
