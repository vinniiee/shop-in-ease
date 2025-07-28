const form = document.querySelector("form");
const error = document.querySelector(".error");

form.addEventListener("submit", submitHandler);

function submitHandler(event) {
  event.preventDefault();

  const form = event.target;
  const formData = new FormData(form);

  const fname = formData.get("fname");
  const lname = formData.get("lname");
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  if (
    fname === "" ||
    lname === "" ||
    email === "" ||
    password === "" ||
    confirmPassword === ""
  ) {
    error.textContent = "All fields are required.";
  } else {
    error.textContent = "";
    if (password !== confirmPassword) {
      error.textContent = "Passwords do not match.";
      return;
    } else {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      users.forEach((user) => {
        if (user.email === email) {
          error.textContent = "Email already exists.";
          return;
        }
      });
      const newUser = {
        fname: fname,
        lname: lname,
        email: email,
        password: password,
      };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      window.location.href = "./shop/index.html";
    }
  }
}
