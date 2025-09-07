import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Get district id from URL
const params = new URLSearchParams(window.location.search);
const districtId = params.get("id");

async function loadDistrictData() {
  if (!districtId) {
    document.getElementById("districtBanner").innerHTML = "<h2>No district selected!</h2>";
    return;
  }

  try {
    // District Details
    const districtRef = doc(db, "districts", districtId);
    const districtSnap = await getDoc(districtRef);

    if (districtSnap.exists()) {
      const districtData = districtSnap.data();

      document.getElementById("districtBanner").innerHTML = `
        <div class="banner" style="background-image: url('${districtData.image}')">
          <div class="banner-overlay">
            <h1>${districtData.name}</h1>
            <p>${districtData.description}</p>
          </div>
        </div>
      `;
    } else {
      document.getElementById("districtBanner").innerHTML = "<h2>District not found!</h2>";
      return;
    }

    // Places under district
    const placesContainer = document.getElementById("placesContainer");
    placesContainer.innerHTML = "";

    const placesSnap = await getDocs(collection(db, `districts/${districtId}/places`));
    if (placesSnap.empty) {
      placesContainer.innerHTML = "<p>No places found for this district.</p>";
      return;
    }

    placesSnap.forEach((placeDoc, index) => {
      const place = placeDoc.data();

      const card = document.createElement("div");
      card.className = "place-card";
      card.innerHTML = `
        <img src="${place.image || "placeholder.jpg"}" alt="${place.name}">
        <h3>${place.name}</h3>
        <p>${place.description ? place.description.substring(0, 100) + "..." : "No description available."}</p>
        <button onclick="viewPlace('${districtId}', '${placeDoc.id}')">View Details</button>
      `;

      // Animation
      setTimeout(() => card.classList.add("visible"), index * 200);

      placesContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error loading district data:", error);
    document.getElementById("districtBanner").innerHTML = "<h2>Error loading data!</h2>";
  }
}

// Redirect to place page
window.viewPlace = function(districtId, placeId) {
  window.location.href = `place.html?district=${districtId}&place=${placeId}`;
}

loadDistrictData();
