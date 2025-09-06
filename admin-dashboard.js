// Firebase setup
var firebaseConfig = {
  apiKey: "AIzaSyCDZvBUNUEKEXU5_YeQtgUc-dkMQxbFnTg",
  authDomain: "heritagehub-ede14.firebaseapp.com",
  projectId: "heritagehub-ede14",
  storageBucket: "heritagehub-ede14.firebasestorage.app",
  messagingSenderId: "517516088585",
  appId: "1:517516088585:web:7fc9b19f424e0081a2afd8"
};
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();

// Admin UID
var adminUID = "WMmaACOkQnZGIBAPCGjGBrFDAmC3";

// Redirect non-admins
auth.onAuthStateChanged(function(user) {
  if (!user) {
    window.location.href = "login.html";
  } else if (user.uid !== adminUID) {
    window.location.href = "index.html";
  } else {
    loadDashboardRealtime();
  }
});

// Real-time dashboard
function loadDashboardRealtime() {
  var container = document.getElementById("contributions-container");

  db.collection("contributions").onSnapshot(function(snapshot) {
    var acceptedCount = 0;
    var pendingCount = 0;
    container.innerHTML = ""; // clear old cards

    snapshot.forEach(function(doc) {
      var data = doc.data();
      var id = doc.id;

      if (data.status === "accepted") acceptedCount++;
      else if (data.status === "pending") pendingCount++;

      var card = document.createElement("div");
      card.classList.add("card");

      let actionButtons = '';
      if (data.status === "pending") {
        actionButtons = `
          <button class="accept-btn">Accept ✅</button>
          <button class="reject-btn">Reject ❌</button>
        `;
      }

      card.innerHTML = `
        <h3>${data.placeName}</h3>
        <p>${data.description}</p>
        <p>Status: <strong>${data.status}</strong></p>
        ${actionButtons}
        <hr>
      `;

      container.appendChild(card);

      if (data.status === "pending") {
        card.querySelector(".accept-btn").addEventListener("click", function() {
          acceptContribution(id, data);
        });
        card.querySelector(".reject-btn").addEventListener("click", function() {
          rejectContribution(id);
        });
      }
    });

    loadChartRealtime(acceptedCount, pendingCount);
  });
}

// Accept contribution
function acceptContribution(docId, data) {
  db.collection("verified_contributions").doc(docId).set({
    ...data,
    status: "accepted",
    verifiedAt: firebase.firestore.Timestamp.now()
  })
  .then(function() {
    return db.collection("contributions").doc(docId).update({
      status: "accepted"
    });
  })
  .then(function() {
    showToast("Contribution accepted and verified!");
  })
  .catch(function(err) { console.error(err); });
}

// Reject contribution
function rejectContribution(docId) {
  db.collection("contributions").doc(docId).update({
    status: "rejected"
  })
  .then(function() {
    showToast("Contribution rejected!");
  })
  .catch(function(err) { console.error(err); });
}

// Toast function
function showToast(msg) {
  var toast = document.createElement("div");
  toast.innerText = msg;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.right = "20px";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "5px";
  toast.style.zIndex = 1000;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 3000);
}

// Real-time chart
var statsChart;
function loadChartRealtime(accepted, pending) {
  db.collection("users").get().then(function(usersSnap) {
    var totalUsers = usersSnap.size;
    var ctx = document.getElementById('statsChart').getContext('2d');

    if (statsChart) statsChart.destroy();

    statsChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Total Users', 'Accepted Contributions', 'Pending Contributions'],
        datasets: [{
          label: 'Stats',
          data: [totalUsers, accepted, pending],
          backgroundColor: ['#4CAF50', '#2196F3', '#FFC107']
        }]
      },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });
  });
}
