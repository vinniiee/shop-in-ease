const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser != null) {
  location.href = "/shop";
}

if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}

const basePath =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? ""
    : "/shop-in-ease";

if (basePath !== "") {
  document.querySelectorAll("a").forEach((link) => {
    link.setAttribute("href", basePath + link.getAttribute("href"));
  });
}
