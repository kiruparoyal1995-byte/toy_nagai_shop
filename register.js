
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword =
    document.getElementById("confirmPassword").value;

  const message = document.getElementById("registerMessage");

  if (password !== confirmPassword) {
    message.textContent = "Passwords do not match.";
    return;
  }

  message.textContent = "Creating your account...";

  try {
    const response = await fetch(
      "http://localhost:5000/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, mobile, password })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent = data.message || "Registration failed.";
      return;
    }

    message.textContent =
      "Registration successful! Redirecting to login...";

    registerForm.reset();

    setTimeout(() => {
      window.location.href = "login.html";
    }, 1200);

  } catch (error) {
    console.error("Registration error:", error);
    message.textContent =
      "Cannot connect to server. Check whether the backend is running.";
  }
});
