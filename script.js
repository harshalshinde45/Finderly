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

  list.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      ${item.images?.length ? `<img src="${item.images[0]}" alt="Item Image">` : ""}
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <p><b>Location:</b> ${item.location}</p>
      <span class="status ${item.status}">${item.status.toUpperCase()}</span>
    `;
    card.addEventListener("click", () => openItemDetail(item));
    container.appendChild(card);
  });
}

// ===== Add New Item =====
function addItem(form) {
  const files = form.querySelector("input[type=file]").files;
  const imageUrls = [...files].map(file => URL.createObjectURL(file));

  const data = {
    name: form.querySelector("input[type=text]").value,
    desc: form.querySelector("textarea").value,
    location: form.querySelectorAll("input[type=text]")[1].value,
    status: form.querySelector("select").value,
    images: imageUrls
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

// ===== Modal Functions =====
function openItemDetail(item) {
  document.getElementById("modalMainImage").src = item.images?.[0] || "";
  document.getElementById("modalName").innerText = item.name;
  document.getElementById("modalDesc").innerText = item.desc;
  document.getElementById("modalLocation").innerText = item.location;
  document.getElementById("modalStatus").innerText = item.status.toUpperCase();

  const extraContainer = document.getElementById("modalExtraImages");
  extraContainer.innerHTML = "";
  if (item.images && item.images.length > 1) {
    item.images.slice(1).forEach(img => {
      const thumb = document.createElement("img");
      thumb.src = img;
      thumb.addEventListener("click", () => {
        document.getElementById("modalMainImage").src = img;
      });
      extraContainer.appendChild(thumb);
    });
  }

  document.getElementById("itemModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("itemModal").style.display = "none";
}

window.addEventListener("click", e => {
  const modal = document.getElementById("itemModal");
  if (e.target === modal) closeModal();
});
function findMatchingItems(newItem) {
  const matches = [];

  const newWords = newItem.desc.toLowerCase().split(/\W+/);

  items.forEach(existing => {
    if (existing === newItem) return; // skip self

    const existingWords = existing.desc.toLowerCase().split(/\W+/);
    const commonWords = newWords.filter(word => existingWords.includes(word));

    const similarity = (commonWords.length / newWords.length) * 100;

    if (similarity >= 40) { // 40% similarity threshold
      matches.push({ item: existing, score: similarity });
    }
  });

  return matches.sort((a, b) => b.score - a.score);
}
function addItem(form) {
  const files = form.querySelector("input[type=file]").files;
  const imageUrls = [...files].map(file => URL.createObjectURL(file));

  const data = {
    name: form.querySelector("input[type=text]").value,
    desc: form.querySelector("textarea").value,
    location: form.querySelectorAll("input[type=text]")[1].value,
    status: form.querySelector("select").value,
    images: imageUrls
  };

  items.unshift(data);

  // 🔍 Match descriptions in background
  const matches = findMatchingItems(data);
  if (matches.length > 0) {
    alert(`We found ${matches.length} similar item(s) already reported!\n` +
      matches.map(m => `• ${m.item.name} (${m.item.status}) – ${m.score.toFixed(1)}% match`).join("\n")
    );
  }

  renderItems();
  form.reset();
  showPage("items");
}
