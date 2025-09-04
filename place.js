import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.firebasestorage.app",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get type from URL (temple, fort, palace…)
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

// DOM references
const placesContainer = document.getElementById("placesContainer");
const pageTitle = document.getElementById("pageTitle");

// Load places by type
async function loadPlaces() {
  if (!type) {
    pageTitle.textContent = "No type selected.";
    return;
  }

  pageTitle.textContent = `Showing all ${type} places`;

  try {
    const districtsSnap = await getDocs(collection(db, "districts"));
    let found = false;

    for (const district of districtsSnap.docs) {
      const placesSnap = await getDocs(collection(db, "districts", district.id, "places"));

      placesSnap.forEach(placeDoc => {
        const place = placeDoc.data();
        if (place.type && place.type.toLowerCase() === type.toLowerCase()) {
          found = true;
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <img src="${place.image}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description.substring(0, 100)}...</p>
          `;
          placesContainer.appendChild(card);
        }
      });
    }

    if (!found) {
      placesContainer.innerHTML = `<p>No ${type} places found.</p>`;
    }
  } catch (err) {
    console.error("Error loading places:", err);
    placesContainer.innerHTML = `<p>Failed to load places. Check console.</p>`;
  }
}

loadPlaces();
// Select popup elements
const popup = document.getElementById("popup");
const popupImg = document.getElementById("popup-img");
const popupTitle = document.getElementById("popup-title");
const popupDesc = document.getElementById("popup-desc");
const closeBtn = document.querySelector(".close-btn");

// Card click → open popup
document.addEventListener("click", (e) => {
  if (e.target.closest(".card")) {
    const card = e.target.closest(".card");
    const img = card.querySelector("img").src;
    const title = card.querySelector("h3").innerText;
    const desc = card.querySelector("p").innerText;

    popupImg.src = img;
    popupTitle.innerText = title;
    popupDesc.innerText = desc;

    popup.style.display = "flex"; // show popup
  }
});

// Close popup
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

// Close on outside click
window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});
