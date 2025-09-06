import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

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

// Get IDs from URL
const params = new URLSearchParams(window.location.search);
const districtId = params.get("district");
const placeId = params.get("place");

async function loadPlaceData() {
  if (!districtId || !placeId) return;

  try {
    const placeRef = doc(db, `districts/${districtId}/places`, placeId);
    const placeSnap = await getDoc(placeRef);

    if (!placeSnap.exists()) {
      document.getElementById("placeName").textContent = "Place not found!";
      return;
    }

    const place = placeSnap.data();

    // Banner
    document.getElementById("placeBanner").style.backgroundImage = `url('${place.image}')`;
    document.querySelector("#placeBanner h1").textContent = place.name;

    // Content
    document.getElementById("placeName").textContent = place.name;
    document.getElementById("placeDescription").textContent = place.description;

    // ✅ Map (free iframe method)
    document.getElementById("mapFrame").src =
      `https://maps.google.com/maps?q=${place.latitude},${place.longitude}&z=15&output=embed`;

    // Route button
    document.getElementById("routeBtn").addEventListener("click", () => {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`, "_blank");
    });

    // Weather
    document.getElementById("weatherBtn").addEventListener("click", () => getWeather(place.latitude, place.longitude, place.name));

    // Ratings
    updateRatingUI(place.ratings || []);
    setupRating(placeRef, place.ratings || []);
  } catch (err) {
    console.error("Error loading place:", err);
  }
}

function showPopup(title, content) {
  document.getElementById('popupTitle').textContent = title;
  document.getElementById('popupContent').textContent = content;
  document.getElementById('customPopup').style.display = 'block';
  document.getElementById('popupOverlay').style.display = 'block';
}

// Weather
async function getWeather(lat, lng, placeName) {
  const apiKey = "a6c82c2662d7e6ccc29bb66f289ae1d8"; // OpenWeather key
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.main) {
      const message =
        `🌡 Temp: ${data.main.temp}°C\n` +
        `☁️ Condition: ${data.weather[0].description}\n` +
        `💧 Humidity: ${data.main.humidity}%`;

      showPopup(`🌍 Weather at ${placeName}`, message);
    } else {
      showPopup("Weather Info", "Weather data not found!");
    }
  } catch (err) {
    console.error(err);
    showPopup("Error", "Failed to fetch weather.");
  }
}

// Rating system
function updateRatingUI(ratings) {
  const avgRatingEl = document.getElementById("avgRating");
  if (ratings.length === 0) {
    avgRatingEl.textContent = "Average Rating: Not yet rated";
  } else {
    const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    avgRatingEl.textContent = `Average Rating: ${avg} ⭐ (${ratings.length} votes)`;
  }
}

function setupRating(placeRef, currentRatings) {
  const stars = document.querySelectorAll("#ratingStars span");

  stars.forEach(star => {
    star.addEventListener("click", async () => {
      const ratingValue = parseInt(star.dataset.value);

      try {
        await updateDoc(placeRef, {
          ratings: arrayUnion(ratingValue)
        });
        currentRatings.push(ratingValue);
        updateRatingUI(currentRatings);
        showPopup("Thank you!", "⭐ Thanks for your rating!");
      } catch (err) {
        console.error("Error saving rating:", err);
        showPopup("Error", "Failed to save your rating.");
      }
    });
  });
}

loadPlaceData();
