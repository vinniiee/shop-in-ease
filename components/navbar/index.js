document.addEventListener("DOMContentLoaded", () => {
  const basePath =
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
      ? ""
      : "/shop-in-ease";

  const nav = document.createElement("nav");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (currentUser == null) {
    nav.innerHTML = `
      <div class="brand">
        <a href="${basePath}/">ShopInEase</a>
      </div>
      <div class="nav-items">
        <a href="${basePath}/">Home</a>
        <a href="${basePath}/login/index.html">Login</a>
        <a href="${basePath}/signup/index.html">Signup</a>
      </div>`;
  } else {
    nav.innerHTML = `
      <div class="brand">
        <a href="${basePath}/">ShopInEase</a>
      </div>
      <div class="nav-items">
        <a href="${basePath}/">Home</a>
        <a href="${basePath}/profile/index.html">Profile</a>
        <a href="#" id="signout-link">Signout</a>
        <a href="${basePath}/cart/index.html">My Cart</a>
      </div>`;
  }

  document.body.insertBefore(nav, document.body.firstChild);

  const signoutBtn = document.getElementById("signout-link");
  if (signoutBtn) {
    signoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = `${basePath}/login/index.html`;
    });
  }
});
