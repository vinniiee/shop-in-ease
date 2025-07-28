document.addEventListener("DOMContentLoaded", () => {
  const nav = document.createElement("nav");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser == null) {
    nav.innerHTML = `<div class="brand">
                      <a href="/">ShopInEase</a>
                    </div>
                    <div class="nav-items">
                      <a href="/">Home</a>
                      <a href="/login">Login</a>
                      <a href="/signup">Signup</a>
                    </div>`;
  } else {
    nav.innerHTML = `<div class="brand">
                      <a href="/">ShopInEase</a>
                    </div>
                    <div class="nav-items">
                      <a href="/">Home</a>
                      <a href="/signout">Signout</a>
                      <a href="/cart">My Cart</a>
                    </div>`;
  }

  document.body.insertBefore(nav, document.body.firstChild);

  const signoutBtn = document.querySelector('.nav-items a[href="/signout"]');
  if (signoutBtn) {
    signoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "/login";
    });
  }
});
