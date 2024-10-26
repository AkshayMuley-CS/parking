let vehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
let editIndex = -1;
let deferredPrompt;

function saveVehicle() {
  const vehicleNumber = document.getElementById("vehicleNumber").value;
  const ownerName = document.getElementById("ownerName").value;
  const houseNumber = document.getElementById("houseNumber").value;
  const contactNumber = document.getElementById("contactNumber").value;
  
  const vehicle = { vehicleNumber, ownerName, houseNumber, contactNumber };

  if (editIndex >= 0) {
    vehicles[editIndex] = vehicle;
    editIndex = -1;
    document.getElementById("saveButton").innerText = "Add Vehicle";
  } else {
    vehicles.push(vehicle);
  }

  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  renderTable();
  resetForm();
}

function renderTable() {
  const tableBody = document.querySelector("#vehicleList tbody");
  tableBody.innerHTML = "";

  vehicles.forEach((vehicle, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${vehicle.vehicleNumber}</td>
      <td>${vehicle.ownerName}</td>
      <td>${vehicle.houseNumber}</td>
      <td>${vehicle.contactNumber}</td>
      <td>
        <button onclick="editVehicle(${index})">Edit</button>
        <button onclick="deleteVehicle(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function editVehicle(index) {
  const vehicle = vehicles[index];
  document.getElementById("vehicleNumber").value = vehicle.vehicleNumber;
  document.getElementById("ownerName").value = vehicle.ownerName;
  document.getElementById("houseNumber").value = vehicle.houseNumber;
  document.getElementById("contactNumber").value = vehicle.contactNumber;
  document.getElementById("saveButton").innerText = "Save Changes";
  editIndex = index;
}

function deleteVehicle(index) {
  vehicles.splice(index, 1);
  localStorage.setItem("vehicles", JSON.stringify(vehicles));
  renderTable();
}

function searchRecords() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const rows = document.querySelectorAll("#vehicleList tbody tr");

  rows.forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(searchTerm) ? "" : "none";
  });
}

function resetForm() {
  document.getElementById("vehicleNumber").value = "";
  document.getElementById("ownerName").value = "";
  document.getElementById("houseNumber").value = "";
  document.getElementById("contactNumber").value = "";
}

document.addEventListener("DOMContentLoaded", renderTable);

// Register service worker for PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => console.log("Service Worker registered"))
      .catch(err => console.error("Service Worker registration failed:", err));
  });
}

// Handle installation prompt
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById("installButton").style.display = "block";

  document.getElementById("installButton").addEventListener("click", () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the install prompt");
      }
      deferredPrompt = null;
    });
  });
});
