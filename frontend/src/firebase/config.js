import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCfttCQROxHjhKAGOeVqvSgfXvECkyK2kQ",
  authDomain: "resumebuilder-bc049.firebaseapp.com",
  projectId: "resumebuilder-bc049",
  storageBucket: "resumebuilder-bc049.firebasestorage.app",
  messagingSenderId: "512714928984",
  appId: "1:512714928984:web:8d105083579877b72b6b2d",
  measurementId: "G-ER40S427L4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider
};