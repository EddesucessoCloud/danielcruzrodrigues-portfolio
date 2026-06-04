(function () {
  var titles = [
    "Senior Data Engineer",
    "Databricks Specialist",
    "AWS Expert",
    "Big Data Architect",
    "AI/ML Practitioner",
  ];

  var el = document.querySelector(".hero-role");
  if (!el) return;

  var idx = 0;
  var charIdx = 0;
  var deleting = false;
  var pauseTicks = 0;
  var PAUSE = 28; // ticks to pause at full word

  function tick() {
    var current = titles[idx];

    if (deleting) {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % titles.length;
      }
    } else {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        if (pauseTicks < PAUSE) {
          pauseTicks++;
        } else {
          pauseTicks = 0;
          deleting = true;
        }
      }
    }

    var delay = deleting ? 38 : charIdx === current.length ? 100 : 65;
    setTimeout(tick, delay);
  }

  // Start after a short delay so the page has settled
  setTimeout(tick, 1800);
})();
