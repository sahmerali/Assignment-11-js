const products = [
  { id: 1, title: "Burger 01", category: "Burger", price: 500, rating: 4, description: "Delicious burger", image: "./images/burger 01.jpg"},
  { id: 2, title: "Burger 02", category: "Burger", price: 250, rating: 5, description: "Delicious burger", image: "./images/burger 02.jpg" },
  { id: 3, title: "Burger 03", category: "Burger", price: 600, rating: 3, description: "Delicious burger", image: "./images/burger 03.jpg" },
  { id: 5, title: "Shawarma 01", category: "Shawarma", price: 200, rating: 5, description: "Tasty shawarma", image: "./images/shawarma 01.jpg" },
  { id: 6, title: "Shawarma 02", category: "Shawarma", price: 200, rating: 5, description: "Tasty shawarma", image: "./images/Shawarma 02.jpg" },
  { id: 7, title: "Shawarma 03", category: "Shawarma", price: 250, rating: 5, description: "Tasty shawarma", image: "./images/shawarma 03.jpg" },
  { id: 9, title: "Pizza 01", category: "Pizza", price: 1200, rating: 2, description: "Cheesy pizza", image: "./images/Pizza 01.jpg" },
  { id: 10, title: "Pizza 02", category: "Pizza", price: 450, rating: 5, description: "Cheesy pizza", image: "./images/Pizza 02.jpg" },
  { id: 11, title: "Pizza 03", category: "Pizza", price: 2000, rating: 4, description: "Cheesy pizza", image: "./images/Pizza 03.jpg" },
];

const categories = [...new Set(products.map(p => p.category))];

const categoryFilter = document.getElementById("categoryFilter");
const ratingFilter = document.getElementById("ratingFilter");
const priceRange = document.getElementById("priceRange");
const minPriceText = document.getElementById("minPrice");
const maxPriceText = document.getElementById("maxPrice");
const productList = document.getElementById("productList");
const clearFiltersTop = document.getElementById("clearFiltersTop");

let selectedCategory = [];
let selectedRating = null;

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
    div.innerHTML = `<span data-rating="${i}" class="rating-star text-yellow-400">${"★".repeat(i)}${"☆".repeat(5 - i)}</span><span class="ml-1">${i}+</span>`;
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
  if (selectedCategory.length > 0) {
    data = data.filter(p => selectedCategory.includes(p.category));
  }
  if (selectedRating) {
    data = data.filter(p => p.rating >= selectedRating);
  }
  data = data.filter(p => p.price <= parseInt(priceRange.value, 10));
  return data;
}

function renderProducts() {
  const data = getFilteredProducts();
  productList.innerHTML = data.map(p => `
    <div class="bg-white p-4 rounded shadow text-center">
      <img src="${p.image}" alt="${p.title}" class="w-full h-40 object-cover mb-2 rounded"/>
      <h3 class="font-bold text-lg text-blue-600">${p.title}</h3>
      ${renderStars(p.rating)}
      <p class="text-lg mt-1 font-semibold">Rs ${p.price}</p>
    </div>
  `).join("");
}

function clearAllFilters() {
  categoryFilter.querySelectorAll("input").forEach(i => i.checked = false);
  ratingFilter.querySelectorAll(".rating-star").forEach(star => star.classList.remove("text-red-500"));
  selectedCategory = [];
  selectedRating = null;
  priceRange.value = priceRange.max;
  maxPriceText.textContent = priceRange.max;
  renderProducts();
}

function addEventListeners() {
  categoryFilter.addEventListener("change", () => {
    selectedCategory = Array.from(categoryFilter.querySelectorAll("input:checked")).map(i => i.value);
    renderProducts();
  });

  ratingFilter.addEventListener("click", e => {
    const el = e.target.closest(".rating-star");
    if (!el) return;
    ratingFilter.querySelectorAll(".rating-star").forEach(star => star.classList.remove("text-red-500"));
    el.classList.add("text-red-500");
    selectedRating = parseInt(el.dataset.rating, 10);
    renderProducts();
  });

  priceRange.addEventListener("input", () => {
    maxPriceText.textContent = priceRange.value;
    renderProducts();
  });

  clearFiltersTop.addEventListener("click", clearAllFilters);
}

initFilters();
addEventListeners();
renderProducts();
