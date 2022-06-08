// Imported Functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";

// Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKUmS0OuoK_owgHaGXfv4ctwsMjCDQ_GA",
  authDomain: "custom-ringtone-creator.firebaseapp.com",
  projectId: "custom-ringtone-creator",
  storageBucket: "custom-ringtone-creator.appspot.com",
  messagingSenderId: "1027503112772",
  appId: "1:1027503112772:web:483f4f91f174d985abb211",
  measurementId: "G-70ECE91MFC"
};  firebase.initializeApp(firebaseConfig) // Initializing Firebase

// Global Storage Variables
window.storage = firebase.storage();
window.firestore = firebase.firestore();