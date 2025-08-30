import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.appspot.com",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function loadDistricts() {
  const container = document.getElementById("districts");
  container.innerHTML = "";

  try {
    const snapshot = await getDocs(collection(db, "districts"));
    snapshot.forEach((doc, i) => {
      const data = doc.data();
      const districtId = doc.id;

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${data.image}" alt="${data.name}">
        <div class="card-content">
          <h3>${data.name}</h3>
          <p>${data.description}</p>
          <button class="view-more">View More</button>
        </div>
      `;

      card.querySelector(".view-more").addEventListener("click", () => {
        window.location.href = `district.html?id=${districtId}`;
      });

      container.appendChild(card);

      // staggered animation
      setTimeout(() => card.classList.add("visible"), i * 150);
    });
  } catch (err) {
    console.error("Firestore error:", err);
    container.innerHTML = "<p>Error loading data.</p>";
  }
}

loadDistricts();
