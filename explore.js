console.log("hello");

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
  console.log("📡 Fetching districts from Firestore...");

  const container = document.getElementById("districts");
  container.innerHTML = ""; 

  try {
    const snapshot = await getDocs(collection(db, "districts"));
    if (snapshot.empty) {
      container.innerHTML = "<p>No data found.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`✅ Document: ${doc.id}`, data);

      const card = document.createElement("div");
      card.className = "card";

      card.innerHTML = `
        <img src="${data.image}" alt="${data.name}">
        <div class="card-content">
          <h3>${data.name}</h3>
          <p>${data.description}</p>
          <button>View More</button>
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("❌ Firestore fetch error:", err);
    container.innerHTML = "<p>Error loading data.</p>";
  }
}

loadDistricts();
