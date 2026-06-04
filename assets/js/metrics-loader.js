/* metrics-loader.js — injects curated impact metrics from data/metrics.json
   into elements tagged with data-metric-id / data-metric-label.
   Phase 1: static display (no count-up). Phase 2 wires count-up animation
   on top of the same elements. Mirrors the fetch-and-inject pattern of
   visitorcount.js. Vanilla ES module — no jQuery. */

export async function initMetrics(url = "/data/metrics.json") {
  const valueNodes = document.querySelectorAll("[data-metric-id]");
  if (!valueNodes.length) return;

  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error(`metrics fetch failed: ${res.status}`);
    const data = await res.json();
    const byId = new Map((data.metrics || []).map((m) => [m.id, m]));

    valueNodes.forEach((node) => {
      const metric = byId.get(node.dataset.metricId);
      if (!metric) return;

      // Value (tabular-nums container is locked in CSS for CLS safety).
      node.textContent = metric.value;
      if (metric.aria) node.setAttribute("aria-label", metric.aria);

      // Optional sibling label, tagged with the same id.
      const labelNode = document.querySelector(
        `[data-metric-label="${metric.id}"]`
      );
      if (labelNode && metric.label) labelNode.textContent = metric.label;
    });
  } catch (err) {
    console.error("Metrics load failed:", err);
    // Leave the "—" fallback already present in markup. No layout shift.
  }
}
