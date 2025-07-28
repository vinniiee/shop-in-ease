// Add this script to any page that requires user authentication

const currentUser = localStorage.getItem("currentUser");
if (!currentUser) {
  window.location.href = "/login/index.html";
}