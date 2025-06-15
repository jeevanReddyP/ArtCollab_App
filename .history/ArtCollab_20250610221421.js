<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDncEefiy5Vhgc8E5bquw8HbLeELdDc_Jo",
    authDomain: "artcollabapp-a4cee.firebaseapp.com",
    projectId: "artcollabapp-a4cee",
    storageBucket: "artcollabapp-a4cee.firebasestorage.app",
    messagingSenderId: "122912441944",
    appId: "1:122912441944:web:4154b9af76205cdb846c2d",
    measurementId: "G-7292QM2ZF2"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>