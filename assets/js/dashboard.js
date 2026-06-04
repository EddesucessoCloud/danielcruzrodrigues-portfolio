/* dashboard.js — animated impact dashboard (Phase 2 headline feature).
   Reads curated KPIs from data/metrics.json, animates count-up on scroll-entry
   with a staggered GSAP entrance. Accessibility: honors prefers-reduced-motion
   (snaps to final values, no motion) and announces final values ONCE via a
   visually-hidden aria-live region (counters themselves are aria-hidden).
   CLS-safe: numbers are monospace + tabular-nums inside a fixed grid. */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const fmt = (m, n) => `${m.prefix || ""}${n}${m.suffix || ""}`;

export async function initDashboard(url = "/data/metrics.json") {
  const root = document.getElementById("impact");
  if (!root) return;

  let data;
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`metrics ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.error("Impact metrics load failed:", err);
    return; // markup keeps its static fallback values — no layout shift
  }

  const byId = new Map((data.metrics || []).map((m) => [m.id, m]));
  const cards = Array.from(root.querySelectorAll("[data-metric-id]"))
    .map((el) => ({ el, num: el.querySelector("[data-metric-value]"),
                    lbl: el.querySelector("[data-metric-label]"),
                    m: byId.get(el.dataset.metricId) }))
    .filter((c) => c.m && c.num);

  // Populate labels + per-card aria now (independent of motion).
  cards.forEach(({ el, lbl, m }) => {
    if (lbl && m.label) lbl.textContent = m.label;
    if (m.aria) el.setAttribute("aria-label", m.aria);
    el.querySelector("[data-metric-value]").setAttribute("aria-hidden", "true");
  });

  // Visually-hidden live region: announce final values once.
  const live = document.createElement("p");
  live.className = "sr-only";
  live.setAttribute("aria-live", "polite");
  root.appendChild(live);
  const announce = () =>
    (live.textContent = cards.map((c) => `${c.m.label}: ${c.m.value}`).join(". "));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) {
    cards.forEach((c) => (c.num.textContent = fmt(c.m, c.m.to)));
    announce();
    return;
  }

  // Animate: start hidden + at zero, count up + slide in on scroll-entry.
  gsap.set(cards.map((c) => c.el), { opacity: 0, y: 20 });
  cards.forEach((c) => (c.num.textContent = fmt(c.m, 0)));

  const tl = gsap.timeline({ paused: true });
  cards.forEach((c, i) => {
    const counter = { v: 0 };
    tl.to(c.el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, i * 0.08)
      .to(counter, {
        v: c.m.to,
        duration: 1.2,
        ease: "power1.out",
        onUpdate: () => (c.num.textContent = fmt(c.m, Math.round(counter.v))),
      }, "<");
  });

  ScrollTrigger.create({
    trigger: root,
    start: "top 80%",
    once: true,
    onEnter: () => {
      tl.play();
      announce();
    },
  });
}
