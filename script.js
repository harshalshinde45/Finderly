// ===== In-Memory Storage =====
let items = [];

// ===== Page Navigation =====
function showPage(id) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ===== Render Items =====
function renderItems(list = items) {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p style='text-align:center;color:#777;'>No items yet.</p>";
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p><b>Date:</b> ${item.date}</p>
      <p><b>Location:</b> ${item.location}</p>
      <p><b>Contact:</b> ${item.contact}</p>
      <span class="status ${item.status}">${item.status.toUpperCase()}</span>
    `;
    container.appendChild(card);
  });
}

// ===== Add New Item =====
function addItem(form, status) {
  const data = {
    name: form.querySelector("input[type=text]").value,
    desc: form.querySelector("textarea").value,
    date: form.querySelector("input[type=date]").value,
    location: form.querySelectorAll("input[type=text]")[1].value,
    contact: form.querySelectorAll("input[type=text]")[2].value,
    status: status
  };

  items.unshift(data); // add new item on top
  renderItems();
  form.reset();
  alert(`${status.toUpperCase()} item reported successfully!`);
  showPage("items");
}

// ===== Handle Form Submissions =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("lostForm").addEventListener("submit", e => {
    e.preventDefault();
    addItem(e.target, "lost");
  });

  document.getElementById("foundForm").addEventListener("submit", e => {
    e.preventDefault();
    addItem(e.target, "found");
  });
});

// ===== Search & Filter =====
function filterItems() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filter = document.getElementById("statusFilter").value;

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search);
    const matchesFilter = !filter || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  renderItems(filtered);
}
