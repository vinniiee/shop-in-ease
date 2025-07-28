String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

// const produtc = {
//   id: 1,
//   title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
//   price: 109.95,
//   description:
//     "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
//   category: "men's clothing",
//   image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
//   rating: { rate: 3.9, count: 120 },
// };

let currentCategory = "all";
const initialFilters = {
  colors: new Set(),
  sizes: new Set(),
  rating: 0,
  prices: new Set(),
};
let currentFilters = initialFilters;

document.querySelector("aside").addEventListener("change", (e) => {
  const target = e.target;

  // Color filters
  if (target.name === "color") {
    updateSet(currentFilters.colors, target);
  }

  // Size filters
  if (["s", "m", "l", "xl"].includes(target.id)) {
    updateSet(currentFilters.sizes, target);
  }

  // Price filters
  if (target.name === "prange") {
    updateSet(currentFilters.prices, target);
  }

  // Rating slider
  if (target.id === "range") {
    currentFilters.rating = Number(target.value);
  }

  applyAllFilters();
});

function updateSet(set, input) {
  if (input.checked) {
    set.add(input.id);
  } else {
    set.delete(input.id);
  }
}

function syncAsideCheckboxes() {
  // Colors
  document.querySelectorAll('input[name="color"]').forEach((input) => {
    input.checked = currentFilters.colors.has(input.id);
  });

  // Sizes
  ["s", "m", "l", "xl"].forEach((size) => {
    const sizeInput = document.getElementById(size);
    sizeInput.checked = currentFilters.sizes.has(sizeInput.id);
  });

  // Prices
  document.querySelectorAll('input[name="prange"]').forEach((input) => {
    input.checked = currentFilters.prices.has(input.id);
  });

  // Rating slider
  document.getElementById("range").value = currentFilters.rating;
}

function syncCategoryButtons() {
  document.querySelectorAll(".filter").forEach((btn) => {
    const btnText = btn.textContent.trim().toLowerCase();
    let btnCategory = "";

    switch (btnText) {
      case "mens":
        btnCategory = "men's clothing";
        break;
      case "womens":
        btnCategory = "women's clothing";
        break;
      case "jewellery":
        btnCategory = "jewelery";
        break;
      case "electronics":
        btnCategory = "electronics";
        break;
      default:
        btnCategory = "all";
    }

    if (btnCategory === currentCategory) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

clearAllAsideFilters = () => {
  currentFilters = initialFilters;
  // currentCategory = "all";
  document.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
  document.getElementById("range").value = 0;
  // applyAllFilters();
};

async function applyAllFilters() {
  // await fetchProducts();
  const allProducts = JSON.parse(localStorage.getItem("products") || "[]");

  // 1. Category filter
  let filtered =
    currentCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === currentCategory);

  // 2. Rating filter
  filtered = filtered.filter((p) => p.rating.rate >= currentFilters.rating);

  // 3. Price range
  if (currentFilters.prices.size > 0) {
    filtered = filtered.filter((p) => {
      const price = p.price;
      return (
        (currentFilters.prices.has("0-25") && price >= 0 && price <= 25) ||
        (currentFilters.prices.has("25-50") && price > 25 && price <= 50) ||
        (currentFilters.prices.has("50-100") && price > 50 && price <= 100) ||
        (currentFilters.prices.has("100on") && price > 100)
      );
    });
  }

  // ~ sizes and colors filter are mocked because the API does not provide them ~

  if (currentFilters.sizes.size > 0) {
    filtered = filtered.filter((p) => true);
  }

  if (currentFilters.colors.size > 0) {
    filtered = filtered.filter((p) => {
      return true;
    });
  }

  const title =
    currentCategory === "all" ? "Products" : `${currentCategory} Products`;
  renderProducts(title, filtered);
  syncAsideCheckboxes();
  syncCategoryButtons();
}

async function fetchProducts() {
  const response = await fetch("https://fakestoreapi.com/products");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  console.log(data);
  localStorage.setItem("products", JSON.stringify(data));
  renderProducts("Products", JSON.parse(localStorage.getItem("products")));
}

if (localStorage.getItem("products") === null) {
  fetchProducts();
} else {
  renderProducts("Products", JSON.parse(localStorage.getItem("products")));
}

// Event listener for category buttons

document.querySelector(".filters").addEventListener("click", (e) => {
  let category = "";
  console.log(e.target);
  //checking if the click is over a category button or empty space in filters div
  if (e.target.classList.contains("filter")) {
    document
      .querySelectorAll(".filter")
      .forEach((f) => f.classList.remove("active"));
    e.target.classList.add("active");
    currentFilters = initialFilters;
    clearAllAsideFilters();
    const clickedText = e.target.textContent.trim().toLowerCase();

    switch (clickedText) {
      case "mens":
        category = "men's clothing";
        break;
      case "womens":
        category = "women's clothing";
        break;
      case "jewellery":
        category = "jewelery";
        break;
      case "electronics":
        category = "electronics";
        break;
      default:
        category = "all";
    }
    currentCategory = category;
    // if (category) {
    //   const products = JSON.parse(localStorage.getItem("products") || "[]");
    //   const filteredProducts = products.filter(
    //     (product) => product.category === category
    //   );
    //   renderProducts(`${category} Products`, filteredProducts);
    // } else {
    //   renderProducts("Products", JSON.parse(localStorage.getItem("products")));
    // }
    applyAllFilters();
  }
});

function renderProducts(title = "Products", products = []) {
  const itemTemplate = document.getElementById("item-template");
  const sectionTemplate = document.getElementById("section-template");
  const productsContainer = document.getElementById("products-container");
  const sectionClone = sectionTemplate.content.cloneNode(true);
  sectionClone.querySelector("title").textContent = title.trim().capitalize();

  if (products.length === 0) {
    const noProductsMessage = document.createElement("p");
    noProductsMessage.textContent = "No products available for given slection.";
    productsContainer.innerHTML = "";
    productsContainer.append(noProductsMessage);
    return;
  }
  console.log(products);
  products.forEach((product) => {
    const itemClone = itemTemplate.content.cloneNode(true);

    itemClone.querySelector("img").src = product.image;
    itemClone.querySelector(".price").innerHTML = `&#8377;${
      product.price * 90
    }`;
    itemClone.querySelector(".sized").textContent = "S, M, L";
    itemClone.querySelector(
      ".rating-row"
    ).textContent = `Rating: ${product.rating.rate}`;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.some((item) => item.image === product.image)) {
      itemClone.querySelector(".addBtn").textContent = "Go to Cart";
      itemClone.querySelector(".addBtn").classList.add("to-cart");
      // itemClone.querySelector(".addBtn").removeEventListener("click", arguments.callee);
      itemClone.querySelector(".addBtn").addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/cart";
      });
      itemClone.querySelector(".addBtn").classList.remove("addBtn");
    }
    sectionClone.querySelector(".items").appendChild(itemClone);
  });

  productsContainer.innerHTML = "";
  productsContainer.append(sectionClone);
  document.querySelectorAll(".addBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productElement = e.target.closest(".item");
      const image = productElement.querySelector("img").src;
      e.target.textContent = "Go to Cart";
      e.target.classList.add("to-cart");
      e.target.classList.remove("addBtn");
      // e.target.removeEventListener("click", arguments.callee);
      e.target.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/cart";
      });

      const price = parseFloat(
        productElement
          .querySelector(".price")
          .textContent.replace(/[^\d.]/g, "")
      );
      const rating = parseFloat(
        productElement
          .querySelector(".rating-row")
          .textContent.replace(/[^\d.]/g, "")
      );
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      let products = JSON.parse(localStorage.getItem("products") || "[]");
      let product = products.find((item) => item.image == image);
      const exists = cart.find((item) => item.image === image);
      if (!exists) {
        cart.push({ image, price, rating, name: product.title });
        localStorage.setItem("cart", JSON.stringify(cart));
      }
    });
  });
}

// document.querySelectorAll(".addBtn").forEach((btn) => {
//   btn.addEventListener("click", (e) => {
//     e.preventDefault();
//     const productElement = e.target.closest(".item");
//     const image = productElement.querySelector("img").src;
//     e.target.innerHTML = `<button class="to-cart">Go to Cart</button>`;

//     const price = parseFloat(
//       productElement.querySelector(".price").textContent.replace(/[^\d.]/g, "")
//     );
//     const rating = parseFloat(
//       productElement
//         .querySelector(".rating-row")
//         .textContent.replace(/[^\d.]/g, "")
//     );
//     let cart = JSON.parse(localStorage.getItem("cart") || "[]");

//     const exists = cart.find((item) => item.image === image);
//     if (!exists) {
//       cart.push({ image, price, rating });
//       localStorage.setItem("cart", JSON.stringify(cart));
//     }
//   });
// });
