import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.appspot.com",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Helper: capitalize first letter
function capitalizeFirstLetter(str) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Get district from URL
const urlParams = new URLSearchParams(window.location.search);
let district = urlParams.get("district");

// Validate district
if (!district) {
  document.body.innerHTML = "<h2>No district selected! Open with ?district=Sivagangai</h2>";
} else {
  district = capitalizeFirstLetter(district); // fix case
  document.getElementById("districtName").innerText = district;

  // Redirect to place.html
  function viewPlace(placeId) {
    window.location.href = `place.html?id=${placeId}&district=${district}`;
  }

  // Fetch places
  async function loadPlaces() {
    const placesContainer = document.getElementById("placesContainer");
    placesContainer.innerHTML = "<p>Loading places...</p>";

    try {
      const querySnapshot = await getDocs(collection(db, "districts", district, "places"));

      if (querySnapshot.empty) {
        placesContainer.innerHTML = "<p>No places found in this district.</p>";
        return;
      }

      placesContainer.innerHTML = ""; // clear loading text

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const placeCard = document.createElement("div");
        placeCard.className = "place-card";

        placeCard.innerHTML = `
          <img src="${data.imageURL || 'default.jpg'}" alt="${data.name}">
          <h3>${data.name}</h3>
          <button>View More</button>
        `;

        placeCard.querySelector("button").addEventListener("click", () => {
          viewPlace(doc.id);
        });

        placesContainer.appendChild(placeCard);
      });
    } catch (err) {
      console.error("Error fetching places: ", err);
      placesContainer.innerHTML = "<p>Error loading places. Check district spelling!</p>";
    }
  }

  loadPlaces();
}
