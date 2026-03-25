console.log("script.js connected");

// ✅ Auto-detects environment: uses Render URL in production, localhost in dev
const BACKEND_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:4000"
    : "https://api.render.com/deploy/srv-d71r538ule4c73d1vcag?key=9j1nEKfdkYU"; // 🔁 Replace with your Render backend URL after deploying

document.getElementById("contactForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill all fields");
    return;
  }

  const submitBtn = this.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const res = await fetch(`${BACKEND_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const text = await res.text();

    if (res.ok) {
      alert("✅ Message sent successfully!");
      document.getElementById("contactForm").reset();
    } else {
      alert(`❌ Failed: ${text}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Error connecting to server. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit";
  }
});
