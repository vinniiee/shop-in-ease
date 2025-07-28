String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

renderProducts("My Cart", JSON.parse(localStorage.getItem("cart") || "[]"));
renderReceipt();
// Event listener for category buttons

function renderProducts(title = "Products", products = []) {
  const itemTemplate = document.getElementById("item-template");
  const sectionTemplate = document.getElementById("section-template");
  const productsContainer = document.getElementById("products-container");
  const sectionClone = sectionTemplate.content.cloneNode(true);
  sectionClone.querySelector("title").textContent = title.trim().capitalize();

  if (products.length === 0) {
    const noProductsMessage = document.createElement("p");
    noProductsMessage.textContent = "No products added to the cart.";
    productsContainer.innerHTML = "";
    productsContainer.append(noProductsMessage);
    return;
  }
  console.log(products);
  products.forEach((product) => {
    const itemClone = itemTemplate.content.cloneNode(true);

    itemClone.querySelector("img").src = product.image;
    itemClone.querySelector(".price").innerHTML = `&#8377;${product.price}`;
    itemClone.querySelector(".sized").textContent = "S, M, L";
    itemClone.querySelector(
      ".rating-row"
    ).textContent = `Rating: ${product.rating}`;
    const btn = itemClone.querySelector(".addBtn");
    btn.textContent = "Remove";
    btn.classList.remove("addBtn");

    // Add event listener to remove the product from the cart
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const productElement = e.target.closest(".item");
      const img = productElement.querySelector("img").src;
      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      cart = cart.filter((item) => item.image !== img);

      localStorage.setItem("cart", JSON.stringify(cart));
      renderProducts("My Cart", cart);
    });
    sectionClone.querySelector(".items").appendChild(itemClone);
  });
  productsContainer.innerHTML = "";
  productsContainer.append(sectionClone);
  renderReceipt();
}

document.querySelectorAll(".rmvBtn").forEach((btn) => {
  btn.textContent = "Remove";
  btn.classList.remove("addBtn");

  // Add event listener to remove the product from the cart
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const productElement = e.target.closest(".item");
    const img = productElement.querySelector("img").src;
    let cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart = cart.filter((item) => item.image !== img);

    localStorage.setItem("cart", JSON.stringify(cart));
    renderReceipt();
    renderProducts("My Cart", cart);
  });
});

function renderReceipt() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const orderList = document.querySelector(".order-list");
  orderList.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    total += item.price;
    const orderItem = document.createElement("li");
    orderItem.innerHTML = `
              <p>
                <span class="quantity">1</span>
              x
              <span class="name">${item.name}</span>
              </p>
              <span class="price">${`&#8377; ${item.price}`}</span>
            `;
    orderItem.classList.add("order-item");
    orderList.appendChild(orderItem);
  });
  const totalElement = document.querySelector(".total");
  totalElement.innerHTML = `Total: <span class="total-price">&#8377; ${total.toFixed(
    1
  )}</span>`;
}

const checkoutBtn = document.querySelector(".checkout-btn");

if (JSON.parse(localStorage.getItem("cart") || "[]").length === 0) {
  checkoutBtn.disabled = true;
  checkoutBtn.style.backgroundColor = "#ccc";
  checkoutBtn.style.cursor = "not-allowed";
}

checkoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  if (cart.length === 0) {
    alert(
      "Your cart is empty. Please add items to the cart before checking out."
    );
    return;
  }
  console.log(cart);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  var options = {
    key: "rzp_test_8wNmvfKJWMszhN",
    amount: total * 100, // in paises
    currency: "INR",
    name: "MyShop Checkout",
    description: "This is your order",
    theme: {
      color: "#000",
    },
    image:
      "https://www.mintformations.co.uk/blog/wp-content/uploads/2020/05/shutterstock_583717939.jpg",
    handler: () => {
      localStorage.removeItem("cart");
      window.location.href = "/shop";
    },
  };

  var rzpy1 = new Razorpay(options);
  await rzpy1.open();
});
