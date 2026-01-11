// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAybcs8ETkw3uEfgzgI8p5OZ_14gfH_9A4",
  authDomain: "bikeall-75436.firebaseapp.com",
  projectId: "bikeall-75436",
  storageBucket: "bikeall-75436.firebasestorage.app",
  messagingSenderId: "461066610820",
  appId: "1:461066610820:web:c459ff2865f7402037bad1",
  measurementId: "G-KMFPZB1CY8"
};

const firebaseConfig2 = {
  apiKey: "AIzaSyBz0lQxCCjPZvMC6ZggIVFDdNpzgc1vts4",
  authDomain: "bikeall-f6212.firebaseapp.com",
  projectId: "bikeall-f6212",
  storageBucket: "bikeall-f6212.firebasestorage.app",
  messagingSenderId: "396356948494",
  appId: "1:396356948494:web:f1b7000ce180d4c641625f",
  measurementId: "G-01NB94KRDB"
};







// Initialize Firebase
export const app = initializeApp(firebaseConfig2);
export const analytics = getAnalytics(app);
export const db = getFirestore(app)