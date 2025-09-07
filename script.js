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
      ${item.image ? `<img src="${item.image}" alt="Item Image">` : ""}
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p><b>Location:</b> ${item.location}</p>
      <span class="status ${item.status}">${item.status.toUpperCase()}</span>
    `;
    container.appendChild(card);
  });
}

// ===== Add New Item =====
function addItem(form) {
  const data = {
    name: form.querySelector("input[type=text]").value,
    desc: form.querySelector("textarea").value,
    location: form.querySelectorAll("input[type=text]")[1].value,
    status: form.querySelector("select").value,
    image: form.querySelector("input[type=file]").files[0]
      ? URL.createObjectURL(form.querySelector("input[type=file]").files[0])
      : null
  };

  items.unshift(data);
  renderItems();
  form.reset();
  alert(`Item reported successfully as ${data.status.toUpperCase()}!`);
  showPage("items");
}

// ===== Handle Form Submissions =====
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("reportForm").addEventListener("submit", e => {
    e.preventDefault();
    addItem(e.target);
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
