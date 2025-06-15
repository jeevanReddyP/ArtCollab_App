// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCARhXr1WtK3_Ul8Kr4YrwCUGlma33RQVg",
    authDomain: "artcollabapp-2926c.firebaseapp.com",
    projectId: "artcollabapp-2926c",
    storageBucket: "artcollabapp-2926c.app.app",
    messagingSenderId: "1046839884071",
    appId: "1:1046839884071:web:7b627ae286644995b61102",
    measurementId: "G-JH6L2F77T1"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
