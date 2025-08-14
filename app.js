const products = [
  { id: 1, title: "Burger 01", category: "Burger", price: 500, rating: 4, image: "./images/burger 01.jpg"},
  { id: 2, title: "Burger 02", category: "Burger", price: 250, rating: 5, image: "./images/burger 02.jpg" },
  { id: 3, title: "Burger 03", category: "Burger", price: 600, rating: 3, image: "./images/burger 03.jpg" },
  { id: 4, title: "Burger 04", category: "Burger", price: 700, rating: 5, image: "./images/burger 04.jpg" },  
  { id: 5, title: "Shawarma 01", category: "Shawarma", price: 200, rating: 5, image: "./images/shawarma 01.jpg" },
  { id: 6, title: "Shawarma 02", category: "Shawarma", price: 200, rating: 5, image: "./images/Shawarma 02.jpg" },
  { id: 7, title: "Shawarma 03", category: "Shawarma", price: 250, rating: 5, image: "./images/shawarma 03.jpg" },
  { id: 8, title: "Shawarma 04", category: "Shawarma", price: 250, rating: 5, image: "./images/shawarma 04.jpg" },
  { id: 9, title: "Pizza 01", category: "Pizza", price: 1200, rating: 2, image: "./images/Pizza 01.jpg" },
  { id: 10, title: "Pizza 02", category: "Pizza", price: 450, rating: 5, image: "./images/Pizza 02.jpg" },
  { id: 11, title: "Pizza 03", category: "Pizza", price: 2000, rating: 4, image: "./images/Pizza 03.jpg" },
  { id: 12, title: "Pizza 04", category: "Pizza", price: 2500, rating: 5, image: "./images/Pizza 04.jpg" },
];

const categories = [...new Set(products.map(p => p.category))];
const categoryFilter = document.getElementById("categoryFilter");
const ratingFilter = document.getElementById("ratingFilter");
const priceRange = document.getElementById("priceRange");
const minPriceText = document.getElementById("minPrice");
const maxPriceText = document.getElementById("maxPrice");
const productList = document.getElementById("productList");
const clearFiltersTop = document.getElementById("clearFiltersTop");
const sortSelect = document.getElementById("sortSelect");
const paginationEl = document.getElementById("pagination");
const searchInput = document.getElementById("searchInput");
const itemsPerPageSelect = document.getElementById("itemsPerPageSelect");

let selectedCategory = [];
let selectedRating = null;
let currentSort = "";
let currentPage = 1;
let searchQuery = "";
let itemsPerPage = 6; // default

function initFilters() {
  categories.forEach(cat => {
    const label = document.createElement("label");
    label.classList.add("flex", "items-center", "gap-2");
    label.innerHTML = `<input type="checkbox" value="${cat}" /> <span>${cat}</span>`;
    categoryFilter.appendChild(label);
  });

  for (let i = 5; i >= 1; i--) {
    const div = document.createElement("div");
    div.classList.add("cursor-pointer", "flex", "items-center", "gap-1");
    div.innerHTML = `<span data-rating="${i}" class="rating-star text-yellow-400">${"★".repeat(i)}${"☆".repeat(5 - i)}</span><span>${i}+</span>`;
    ratingFilter.appendChild(div);
  }

  const prices = products.map(p => p.price);
  priceRange.min = Math.min(...prices);
  priceRange.max = Math.max(...prices);
  priceRange.value = priceRange.max;
  minPriceText.textContent = priceRange.min;
  maxPriceText.textContent = priceRange.max;
}

function renderStars(rating) {
  return `<div class="text-yellow-500">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>`;
}

function getFilteredProducts() {
  let data = [...products];

  // Search filter
  if (searchQuery.trim() !== "") {
    data = data.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }

  if (selectedCategory.length > 0) {
    data = data.filter(p => selectedCategory.includes(p.category));
  }
  if (selectedRating) {
    data = data.filter(p => p.rating >= selectedRating);
  }
  data = data.filter(p => p.price <= parseInt(priceRange.value, 10));

  // Sorting
  if (currentSort === "priceAsc") data.sort((a, b) => a.price - b.price);
  if (currentSort === "priceDesc") data.sort((a, b) => b.price - a.price);
  if (currentSort === "ratingAsc") data.sort((a, b) => a.rating - b.rating);
  if (currentSort === "ratingDesc") data.sort((a, b) => b.rating - a.rating);

  return data;
}

function renderProducts() {
  const data = getFilteredProducts();
  const start = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(start, start + itemsPerPage);

  productList.innerHTML = paginatedData.length > 0 ? paginatedData.map(p => `
    <div class="bg-white p-4 rounded shadow text-center">
      <img src="${p.image}" alt="${p.title}" class="w-full h-40 object-cover mb-2 rounded"/>
      <h3 class="font-bold text-lg text-blue-600">${p.title}</h3>
      ${renderStars(p.rating)}
      <p class="text-lg mt-1 font-semibold">Rs ${p.price}</p>
    </div>
  `).join("") : `<p class="text-center text-gray-500 w-full col-span-3">No products found</p>`;

  renderPagination(data.length);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  paginationEl.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `px-3 py-1 rounded ${i === currentPage ? "bg-blue-500 text-white" : "bg-gray-200"}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    paginationEl.appendChild(btn);
  }
}

function clearAllFilters() {
  categoryFilter.querySelectorAll("input").forEach(i => i.checked = false);
  ratingFilter.querySelectorAll(".rating-star").forEach(star => star.classList.remove("text-red-500"));
  selectedCategory = [];
  selectedRating = null;
  searchQuery = "";
  searchInput.value = "";
  priceRange.value = priceRange.max;
  maxPriceText.textContent = priceRange.max;
  currentSort = "";
  sortSelect.value = "";
  currentPage = 1;
  itemsPerPage = 6;
  itemsPerPageSelect.value = "6";
  renderProducts();
}

function addEventListeners() {
  categoryFilter.addEventListener("change", () => {
    selectedCategory = Array.from(categoryFilter.querySelectorAll("input:checked")).map(i => i.value);
    currentPage = 1;
    renderProducts();
  });

  ratingFilter.addEventListener("click", e => {
    const el = e.target.closest(".rating-star");
    if (!el) return;
    ratingFilter.querySelectorAll(".rating-star").forEach(star => star.classList.remove("text-red-500"));
    el.classList.add("text-red-500");
    selectedRating = parseInt(el.dataset.rating, 10);
    currentPage = 1;
    renderProducts();
  });

  priceRange.addEventListener("input", () => {
    maxPriceText.textContent = priceRange.value;
    currentPage = 1;
    renderProducts();
  });

  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    currentPage = 1;
    renderProducts();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    currentPage = 1;
    renderProducts();
  });

  itemsPerPageSelect.addEventListener("change", () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value, 10);
    currentPage = 1;
    renderProducts();
  });

  clearFiltersTop.addEventListener("click", clearAllFilters);
}

initFilters();
addEventListeners();
renderProducts();
