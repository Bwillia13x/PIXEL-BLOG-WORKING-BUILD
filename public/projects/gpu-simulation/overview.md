Absolutely—it’s very doable, and can be stunning. Below is a concise recipe you could follow if you decide to prototype an “Animated GPU-Flow” visualization:

Conceptual Model (keep it high-level)
• Die Outline → divide into Streaming Multiprocessors (SMs), L2 cache slices, shared L1/TMU blocks, memory controllers, PCIe/NVLink pads.
• Flow Types → compute warps, register traffic, shared-memory messages, DRAM requests/returns, power/thermal hotspots.
• Timebase → clock cycles aggregated into “frames” (e.g., 1 ms or 1 warp-round).
Visual Metaphor
• Floor-plan map (SVG or WebGL) coloured like a transit system.
• Packets/warps = glowing pulses that travel along paths; thickness encodes bandwidth.
• SM “stations” show mini pie-charts (active vs stalled warps) or bar gauges (occupancy).
• L2 slices pulse when cache hits/misses occur; DRAM lanes oscillate.
• Hover → tooltip with counters; click → expand to a small dialogue tracing a specific warp.
Tech Stack Options
• 2-D: D3 + GSAP for path morphing and eased motion (simpler, good for browsers).
• 3-D: Three.js overlayed with CSS-styled HUD (lets you tilt/zoom the die).
• Data feed: pre-recorded JSON traces (from nsight, rocprof, or synthetic) → stream via web-worker; real-time WebSocket possible if connected to a profiler.
Data Requirements (can be synthetic at first)
json
{
  "frame": 12345,
  "sm_stats": [{ "id":0, "warps":48, "stall_pct":35 }, …],
  "flows": [
      { "src":"SM0", "dst":"L2_0", "type":"load", "bytes":1024 },
      { "src":"L2_2", "dst":"DRAM", "type":"miss", "bytes":32768 }
  ]
}
Interaction & Pedagogy
• Play / pause / scrub timeline; speed slider.
• Toggle layers (compute vs memory vs power) to avoid clutter.
• “Explain” button pauses and overlays call-outs (“This lane is saturated; why?”) for guided learning.
• Colour legend anchored at bottom-right to reinforce mapping between flow colour and function.
Incremental Build Path
a. Static SVG floor-plan with labelled blocks.
b. Animate a single flow type (memory read) along one lane.
c. Add SM occupancy gauges + throttled JSON data stream.
d. Introduce UI controls and tooltips.
e. Optional: port to WebGL for depth/lighting polish.
Inspiration
• Google’s TPU interactive die shot: webgl-based hotspot overlay.
• Transit-style metro maps (London Underground) for clean path routing.
• “Fireflies” animation in profiler UIs (e.g., NVIDIA Nsight).
So: yes—entirely feasible and a great teaching aid. If you want to start, I can scaffold the static SVG floor-plan and the first animated flow path (step 6a-b) so you can see it alive in the browser.