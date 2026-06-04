/* app.js — single Vite ES-module entry for the portfolio.
   Bundles the design system + theme CSS and boots all client behavior.
   Replaces the jQuery vendor chain (jquery/browser/breakpoints/util/main)
   and the individual classic <script> tags. */

// Styles (bundled + hashed by Vite). Order: Dimension base → custom → tokens.
import "../css/main.css";
import "../css/secondary.css";
import "../css/theme.css";

// Behavior (all vanilla — no jQuery).
import { initNav } from "./nav.js";
import { initMetrics } from "./metrics-loader.js";
import "./typewriter.js";
import "./gototop.js";
import "./contact-form.js";
import "./copyright-year.js";
import "./visitorcount.js";

function boot() {
  initNav();
  initMetrics();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

// Dimension's preload removal (triggers the initial fade-in).
window.addEventListener("load", () => {
  setTimeout(() => document.body.classList.remove("is-preload"), 100);
});
