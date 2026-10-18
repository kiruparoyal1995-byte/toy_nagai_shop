
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value;
  const message = document.getElementById("loginMessage");

  message.textContent = "Checking login...";

  try {
    const response = await fetch(
   "https://toy-nagai-shop.onrender.com/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ mobile, password })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Login failed.";
      return;
    }

    message.textContent = "Login successful! Welcome, " + data.customer.name + ".";

  } catch (error) {
    console.error("Login error:", error);
    message.textContent =
      "Cannot connect to server. Please check that the backend is running.";
  }
});
