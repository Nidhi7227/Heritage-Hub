import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

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

    // Get input values
    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("user").value.trim();
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm").value;
    
    // Get selected interests as array
    const interestsSelect = document.getElementById("interests");
    const interests = Array.from(interestsSelect.selectedOptions).map(opt => opt.value);

    // Input validations
    if (!name || !username || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    // Create the user
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Welcome to HeritageHub, ${name}! 🏛️`);
        window.location.href="index.html";
        
      })
      .catch((error) => {
        console.error("Signup failed:", error);
        alert("Signup error: " + error.message);
      });
  });
});
