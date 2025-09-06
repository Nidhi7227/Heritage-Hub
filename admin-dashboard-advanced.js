// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Initialize Firebase
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
const db = getFirestore(app);

// Admin UID (replace with your actual admin UID from Firebase)
const adminUID = "PASTE_EXACT_ADMIN_UID_HERE";

// DOM elements
const container = document.getElementById("contributions-container");
const searchBar = document.getElementById("searchBar");
const statusFilter = document.getElementById("statusFilter");
const bulkAcceptBtn = document.getElementById("bulkAccept");
const bulkDeleteBtn = document.getElementById("bulkDelete");
const toast = document.getElementById("toast");

let selectedContributions = new Set();
let barChart, pieChart;

// Redirect non-admins
onAuthStateChanged(auth, user => {
  console.log("Logged in UID:", user ? user.uid : "No user"); // Debugging
  if (!user) window.location.href = "login.html";
  else if (user.uid !== adminUID) window.location.href = "index.html";
  else loadDashboardRealtime();
});

// Toast notifications
function showToast(msg) {
  toast.innerText = msg;
  toast.style.display = "block";
  setTimeout(() => { toast.style.display = "none"; }, 3000);
}

// Real-time dashboard
function loadDashboardRealtime() {
  const contribCol = collection(db, "contributions");
  onSnapshot(contribCol, snapshot => {
    container.innerHTML = "";
    let acceptedCount = 0;
    let pendingCount = 0;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;

      const searchText = searchBar.value.toLowerCase();
      const statusValue = statusFilter.value;

      if (
        (data.placeName.toLowerCase().includes(searchText) || data.userName.toLowerCase().includes(searchText)) &&
        (statusValue === "all" || data.status === statusValue)
      ) {
        if (data.status === "accepted") acceptedCount++;
        else pendingCount++;

        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <input type="checkbox" class="select-contribution" data-id="${id}">
          ${data.imageURL ? `<img src="${data.imageURL}">` : ''}
          <div class="card-details">
            <h3>${data.placeName}</h3>
            <p>${data.description}</p>
            <small>User: ${data.userName}</small>
          </div>
          <div class="card-buttons">
            <button class="accept-btn" data-id="${id}">Accept</button>
            <button class="delete-btn" data-id="${id}">Delete</button>
          </div>
        `;
        container.appendChild(card);

        // Single actions
        card.querySelector(".accept-btn").onclick = () => acceptContribution(id, data);
        card.querySelector(".delete-btn").onclick = () => deleteContribution(id);

        // Checkbox selection
        const checkbox = card.querySelector(".select-contribution");
        checkbox.addEventListener("change", e => {
          if (e.target.checked) selectedContributions.add(id);
          else selectedContributions.delete(id);
        });
      }
    });

    loadChartsRealtime(acceptedCount, pendingCount);
  });
}

// Accept single contribution
async function acceptContribution(id, data) {
  await updateDoc(doc(db, "contributions", id), { status: "accepted" });
  await setDoc(doc(db, "verified_contributions", id), data);
  await deleteDoc(doc(db, "contributions", id));
  showToast("Contribution accepted!");
}

// Delete single contribution
async function deleteContribution(id) {
  await deleteDoc(doc(db, "contributions", id));
  showToast("Contribution deleted!");
}

// Bulk actions
bulkAcceptBtn.onclick = async () => {
  for (let id of selectedContributions) {
    const docRef = doc(db, "contributions", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) await acceptContribution(id, docSnap.data());
  }
  selectedContributions.clear();
};

bulkDeleteBtn.onclick = () => {
  selectedContributions.forEach(id => deleteContribution(id));
  selectedContributions.clear();
};

// Charts
async function loadChartsRealtime(accepted, pending) {
  const usersSnap = await getDocs(collection(db, "users"));
  const totalUsers = usersSnap.size;

  const barCtx = document.getElementById("barChart").getContext("2d");
  const pieCtx = document.getElementById("pieChart").getContext("2d");

  if (barChart) barChart.destroy();
  if (pieChart) pieChart.destroy();

  barChart = new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Total Users", "Accepted", "Pending"],
      datasets: [{ label: "Stats", data: [totalUsers, accepted, pending], backgroundColor: ["#4CAF50","#2196F3","#FFC107"] }]
    },
    options: { responsive: true, plugins: { legend: { display: false } } }
  });

  pieChart = new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Accepted", "Pending"],
      datasets: [{ data: [accepted, pending], backgroundColor: ["#2196F3","#FFC107"] }]
    },
    options: { responsive: true }
  });
}

// Search & Filter
searchBar.addEventListener("input", loadDashboardRealtime);
statusFilter.addEventListener("change", loadDashboardRealtime);
