const form = document.querySelector("form");
const error = document.querySelector(".error");

form.addEventListener("submit", submitHandler);

function submitHandler(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const email = formData.get("email");
  const password = formData.get("password");

  if (email === "" || password === "") {
    error.textContent = "All fields are required.";
  } else {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = null;
    users.forEach((user) => {
      if (user.email === email) {
        currentUser = user;

        if (user.password != password) {
          error.textContent = "Invalid username or password";
          return;
        } else {
          error.textContent = "";
          localStorage.setItem("currentUser", JSON.stringify(user));
          window.location.href = "../shop/index.html";
          return;
        }
      }
    });
    if (!currentUser) {
      error.innerHTML = `<span>User not found. Please <a href="signup/" style="color:blue">Sign Up</a>.</span>`;
    }
  }
}
