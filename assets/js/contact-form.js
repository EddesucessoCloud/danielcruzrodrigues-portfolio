document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
  
    if (!form) return;
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
  
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
  
      if (response.ok) {
        alert("✅ Thank you! Your message has been sent.");
        form.reset();
        window.location.hash = "";
      } else {
        alert("❌ Oops! Something went wrong. Please try again.");
        window.location.hash = "";
      }
    });
  });
  