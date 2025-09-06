import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.firebasestorage.app",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const provider = new GoogleAuthProvider();
const google = document.getElementById("google");

google.addEventListener("click", function(event){
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log(user);
      redirectAfterLogin(user); // check admin redirect
    }).catch((error) => {
      console.error(error);
    });
});

// **Add your admin UID here**
const adminUID = "WMmaACOkQnZGIBAPCGjGBrFDAmC3";

function redirectAfterLogin(user) {
  if (user.uid === adminUID) {
    window.location.href = "admin-dashboard.html"; // admin page
  } else {
    window.location.href = "index.html"; // normal user
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login");

  loginBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
  
    if (!username || !email || !password) {
      alert("Please fill out all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        alert(`Welcome to HeritageHub, ${username}! 🏛️`);
        redirectAfterLogin(user); // check admin redirect
      })
      .catch((error) => {
        console.error("Login failed:", error);
        alert("Login error: " + error.message);
      });
  });
});
