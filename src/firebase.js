// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDGlF0XOJDIPjQQ91CIcheVO5lKlJKPJxs",
  authDomain: "ease-526c7.firebaseapp.com",
  databaseURL: "https://ease-526c7-default-rtdb.firebaseio.com",
  projectId: "ease-526c7",
  storageBucket: "ease-526c7.firebasestorage.app",
  messagingSenderId: "692935769364",
  appId: "1:692935769364:web:c4583241bb52f99a4f5601",
  measurementId: "G-KVJ3EC3GNG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);