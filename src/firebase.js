// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMqmVeH8_a_ol2ZEL-IcGDywNsOqXS5Iw",
  authDomain: "madproject-8f396.firebaseapp.com",
  projectId: "madproject-8f396",
  storageBucket: "madproject-8f396.appspot.com",
  messagingSenderId: "639537316218",
  appId: "1:639537316218:web:2e3e9bd4532c5a7d1916c3",
  measurementId: "G-3BRFX3Y8WY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
