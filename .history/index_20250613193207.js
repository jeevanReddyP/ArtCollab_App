// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-storage.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCARhXr1WtK3_Ul8Kr4YrwCUGlma33RQVg",
  authDomain: "artcollabapp-2926c.firebaseapp.com",
  projectId: "artcollabapp-2926c",
  storageBucket: "artcollabapp-2926c.appspot.com",
  messagingSenderId: "1046839884071",
  appId: "1:1046839884071:web:7b627ae286644995b61102",
  measurementId: "G-JH6L2F77T1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Wait until DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {

  const signupButton = document.getElementById("signup-button");
  const loginButton = document.getElementById("login-button");

  if (signupButton) {
    signupButton.addEventListener("click", async () => {
      const email = document.getElementById("signup-email").value;
      const password = document.getElementById("signup-password").value;

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful! Redirecting to login...");
        window.location = "login.html";
      } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed: " + error.message);
      }
    });
  }

  if (loginButton) {
    loginButton.addEventListener("click", async () => {
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        alert("Log-In Successfully!");
        window.location = "dash.html";
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      }
    });
  }
});
