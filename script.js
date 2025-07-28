const currentUser = JSON.parse(localStorage.getItem("currentUser"));

if (currentUser != null) {
    location.href = "/shop";
} 


if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify([]));
}