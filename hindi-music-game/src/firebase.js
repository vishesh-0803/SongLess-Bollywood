// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_V-h_VEuQVzAjNoikvc0xPvynMMBX84A",
  authDomain: "hindi-songless.firebaseapp.com",
  projectId: "hindi-songless",
  storageBucket: "hindi-songless.firebasestorage.app",
  messagingSenderId: "188730348903",
  appId: "1:188730348903:web:c85c2a0716b639cba94bc2",
  measurementId: "G-TN3S7BDM0F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);