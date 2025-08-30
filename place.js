import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.appspot.com",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};

// 🔹 Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Get placeId & district from URL
const urlParams = new URLSearchParams(window.location.search);
const placeId = urlParams.get("id");
const district = urlParams.get("district");

// 🔹 Handle missing parameters
if (!district || !placeId) {
  document.body.innerHTML = "<h2>Invalid URL! Please provide both district and place ID.</h2>";
} else {
  async function loadPlace() {
    try {
      const docRef = doc(db, "districts", district, "places", placeId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        document.body.innerHTML = "<h2>Place not found!</h2>";
        return;
      }

      const data = docSnap.data();

      // 🔹 Set page content
      document.getElementById("placeName").innerText = data.name || "No Name";
      document.getElementById("placeImage").src = data.imageURL || "default.jpg";
      document.getElementById("placeDescription").innerText = data.description || "No description available.";

      // 🔹 Google Map
      if (data.location && data.location.lat && data.location.lng) {
        const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: data.location.lat, lng: data.location.lng },
          zoom: 14
        });

        new google.maps.Marker({
          position: { lat: data.location.lat, lng: data.location.lng },
          map: map,
          title: data.name
        });
      } else {
        document.getElementById("map").innerHTML = "<p>Location not available.</p>";
      }

    } catch (err) {
      console.error("Error fetching place details: ", err);
      document.body.innerHTML = "<h2>Error loading place details.</h2>";
    }
  }

  loadPlace();
}
