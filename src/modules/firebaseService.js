// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js"
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
import { signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANPOiy0ll0bcrQnGHwKynTxUKhtOY1CCU",
  authDomain: "flashycards-579d4.firebaseapp.com",
  databaseURL: "https://flashycards-579d4-default-rtdb.firebaseio.com",
  projectId: "flashycards-579d4",
  storageBucket: "flashycards-579d4.appspot.com",
  messagingSenderId: "1038737646671",
  appId: "1:1038737646671:web:9a2b3348dedd47a19a363a",
  measurementId: "G-R9DC8N9RZK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { analytics, 
        auth, 
        createUserWithEmailAndPassword,
        sendEmailVerification
};
