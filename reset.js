import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const auth = getAuth();

function resetPassword() {
  const email = document.getElementById("resetEmail").value;
  const message = document.getElementById("message");

  sendPasswordResetEmail(auth, email)
    .then(() => {
      message.textContent = "✅ Password reset email sent. Check your inbox!";
      message.style.color = "green";
    })
    .catch((error) => {
      message.textContent = `❌ ${error.message}`;
      message.style.color = "red";
    });
}

window.resetPassword = resetPassword;
