import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { 
  getFirestore, 
  doc, 
  setDoc 
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");

  loginBtn.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("user").value.trim();
    const email = document.getElementById("mail").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm").value;
    
    const interestsSelect = document.getElementById("interests");
    const interests = Array.from(interestsSelect.selectedOptions).map(opt => opt.value);

    if (!name || !username || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user details in Firestore (under 'users' collection)
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        username: username,
        email: email,
        interests: interests,
        createdAt: new Date()
      });

      alert(`Welcome to HeritageHub, ${name}! 🏛️`);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup error: " + error.message);
    }
  });
});
