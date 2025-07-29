const basePath =
  window.location.hostname === "127.0.0.1" ||
  window.location.hostname === "localhost"
    ? ""
    : "/shop-in-ease";

// Add this script to any page that requires user authentication

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = basePath + "/login/index.html";
}
