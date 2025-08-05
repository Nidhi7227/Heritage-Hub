import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.firebasestorage.app",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Wait for the DOM to be fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");

  loginBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    

    // Input validations
    if ( !username || !email || !password ) {
      alert("Please fill out all fields.");
      return;
    }


    // Create the user
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Welcome to HeritageHub, ${name}! 🏛️`);
       window.location.href="index.html";
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login error: " + error.message);
      });
  });
});
