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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get type from URL
const params = new URLSearchParams(window.location.search);
const type = params.get("type");

const placesContainer = document.getElementById("placesContainer");
const pageTitle = document.getElementById("pageTitle");

// CSS for fade-in animation
const style = document.createElement("style");
style.innerHTML = `
  .place-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }
  .place-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

async function loadPlaces() {
  if (!type) {
    pageTitle.textContent = "No type selected.";
    return;
  }

  pageTitle.textContent = `Showing all ${type} places`;

  try {
    const districtsSnap = await getDocs(collection(db, "districts"));
    let found = false;
    let index = 0;

    for (const district of districtsSnap.docs) {
      const placesSnap = await getDocs(collection(db, "districts", district.id, "places"));

      placesSnap.forEach((placeDoc) => {
        const place = placeDoc.data();
        if (place.type && place.type.toLowerCase() === type.toLowerCase()) {
          found = true;

          const card = document.createElement("div");
          card.className = "place-card";
          card.innerHTML = `
            <img src="${place.image || 'placeholder.jpg'}" alt="${place.name}">
            <h3>${place.name}</h3>
            <p>${place.description ? place.description.substring(0, 100) + '...' : 'No description available.'}</p>
            <button onclick="viewPlace('${district.id}', '${placeDoc.id}')">View Details</button>
          `;

          placesContainer.appendChild(card);

          // Apply staggered fade-in animation
          setTimeout(() => card.classList.add("visible"), index * 150);
          index++;
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

// Redirect to place page
window.viewPlace = function(districtId, placeId) {
  window.location.href = `place.html?district=${districtId}&place=${placeId}`;
};

loadPlaces();
// Map type to nicer display names & subtitles
const typeNames = {
  temple: { name: "Temples", subtitle: "Marvel at the architecture and stories of Temples." },
  fort: { name: "Historic Forts", subtitle: "Explore forts that once defended kingdoms across India." },
  palace: { name: "Royal Palaces", subtitle: "Walk through grand palaces that whisper tales of royalty." },
  monument: { name: "Monuments", subtitle: "Discover iconic monuments with rich history." },
  museum: { name: "Museums", subtitle: "Dive into collections and heritage artifacts." },
};

// Use default if type not recognized
const displayType = typeNames[type?.toLowerCase()] || { name: "Heritage Places", subtitle: "Explore the hidden gems across India." };

// Set banner text dynamically
document.getElementById("pageTitle").innerText = displayType.name;
document.getElementById("pageSubtitle").innerText = displayType.subtitle;
