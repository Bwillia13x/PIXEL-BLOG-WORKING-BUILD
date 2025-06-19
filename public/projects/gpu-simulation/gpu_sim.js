// gpu_sim.js
// Phase 1: static floor-plan drawing
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Grab SVG and set up dimensions
const svg = d3.select("#floorplan");
const W = parseInt(svg.style("width"));
const H = parseInt(svg.style("height"));

const P = 30; // padding around die outline

// Draw die outline
svg.append("rect")
  .attr("x", P)
  .attr("y", P)
  .attr("width", W - 2 * P)
  .attr("height", H - 2 * P)
  .attr("rx", 12)
  .attr("ry", 12)
  .attr("fill", "none")
  .attr("stroke", "#555")
  .attr("stroke-width", 2);

// ---- Streaming Multiprocessors (SMs) ----
const smRows = 2;
const smCols = 4;
const smGap = 8;
const smBlockW = (W - 2 * P - (smCols + 1) * smGap) / smCols;
const smBlockH = 100; // fixed height for conceptual clarity

const smGroup = svg.append("g");

let smId = 0;
const blockPos = {};
const smGauges = {}; // map SM id -> rect selection
for (let r = 0; r < smRows; r++) {
  for (let c = 0; c < smCols; c++) {
    const x = P + smGap + c * (smBlockW + smGap);
    const y = P + smGap + r * (smBlockH + smGap);

    const smRect = smGroup.append("rect")
      .attr("class", "sm-block")
      .attr("x", x)
      .attr("y", y)
      .attr("width", smBlockW)
      .attr("height", smBlockH)
      .datum(smId++); // store SM id

    // store center position
    blockPos[`SM${smId - 1}`] = { x: x + smBlockW / 2, y: y + smBlockH / 2 };

    smGroup.append("text")
      .attr("class", "block-label")
      .attr("x", x + smBlockW / 2)
      .attr("y", y + smBlockH / 2)
      .text(`SM${smId - 1}`);

    // gauge bar for occupancy
    const gaugeHeight = 6;
    const gauge = smGroup.append('rect')
      .attr('class', 'sm-gauge')
      .attr('x', x)
      .attr('y', y + smBlockH - gaugeHeight)
      .attr('width', 0)
      .attr('height', gaugeHeight);

    smGauges[smId - 1] = gauge;
  }
}

// ---- L2 Cache Slices ----
const l2Slices = 2;
const l2Gap = 10;
const l2BlockW = smBlockW * 2 + smGap;
const l2BlockH = 60;

for (let i = 0; i < l2Slices; i++) {
  const x = P + smGap;
  const y = P + smRows * (smBlockH + smGap) + l2Gap + i * (l2BlockH + l2Gap);
  svg.append("rect")
    .attr("class", "l2-block")
    .attr("x", x)
    .attr("y", y)
    .attr("width", l2BlockW)
    .attr("height", l2BlockH);

  blockPos[`L2_${i}`] = { x: x + l2BlockW / 2, y: y + l2BlockH / 2 };

  svg.append("text")
    .attr("class", "block-label")
    .attr("x", x + l2BlockW / 2)
    .attr("y", y + l2BlockH / 2)
    .text(`L2_${i}`);
}

// ---- DRAM Controllers ----
const dramCtrls = 2;
const dramGap = 10;
const dramBlockW = smBlockW;
const dramBlockH = 60;

for (let i = 0; i < dramCtrls; i++) {
  const x = W - P - dramBlockW - smGap;
  const y = P + smGap + i * (dramBlockH + dramGap);

  svg.append("rect")
    .attr("class", "dram-block")
    .attr("x", x)
    .attr("y", y)
    .attr("width", dramBlockW)
    .attr("height", dramBlockH);

  blockPos[`DRAM${i}`] = { x: x + dramBlockW / 2, y: y + dramBlockH / 2 };

  svg.append("text")
    .attr("class", "block-label")
    .attr("x", x + dramBlockW / 2)
    .attr("y", y + dramBlockH / 2)
    .text(`DRAM${i}`);
}

// ---- Phase 2: Basic flow animation ----

const controlsDiv = d3.select('#controls');
controlsDiv.style('position', 'relative'); // allow tooltip context

// Play / Pause button
const playBtn = controlsDiv.append('button')
  .attr('class', 'btn')
  .attr('id', 'play-pause')
  .text('Pause');

// Speed slider
controlsDiv.append('label')
  .text(' Speed: ')
  .append('input')
  .attr('type', 'range')
  .attr('min', 50)
  .attr('max', 1000)
  .attr('value', 400)
  .attr('id', 'speed-slider');

let speedMs = 400;

d3.select('#speed-slider').on('input', function() {
  speedMs = +this.value;
  restartTimer();
});

// Layer toggles
const memToggle = controlsDiv.append('label').attr('class', 'toggle');
memToggle.append('input').attr('type', 'checkbox').attr('checked', true).attr('id', 'toggle-mem');
memToggle.append('span').text('Memory Flows');

const compToggle = controlsDiv.append('label').attr('class', 'toggle');
compToggle.append('input').attr('type', 'checkbox').attr('checked', true).attr('id', 'toggle-comp');
compToggle.append('span').text('Compute Gauges');

// Legend
const legend = controlsDiv.append('div').attr('class', 'legend');
legend.append('div').attr('class', 'legend-box').style('background', '#4a9eff');
legend.append('span').text('Memory Load Flow');
legend.append('div').attr('class', 'legend-box').style('background', d3.interpolateBlues(0.8));
legend.append('span').text('SM Occupancy');
legend.append('div').attr('class', 'legend-box').style('background', '#ff6b6b');
legend.append('span').text('Stalled SM (>40%)');

// Tooltip
const tooltip = d3.select('body').append('div').attr('class', 'tooltip');

let isAnimating = true;
let frames = [];
let frameIdx = 0;

playBtn.on('click', () => {
  isAnimating = !isAnimating;
  playBtn.text(isAnimating ? 'Pause' : 'Play');
});

// toggle handlers
function updateLayerVisibility() {
  const memVisible = d3.select('#toggle-mem').property('checked');
  const compVisible = d3.select('#toggle-comp').property('checked');
  svg.selectAll('.flow-circle').style('display', memVisible ? null : 'none');
  svg.selectAll('.sm-gauge').style('display', compVisible ? null : 'none');
}

d3.selectAll('#toggle-mem,#toggle-comp').on('change', updateLayerVisibility);

// animate a single flow object {src,dst,bytes,type}
function animateFlow(flow) {
  const src = blockPos[flow.src];
  const dst = blockPos[flow.dst];
  if (!src || !dst) return;

  const circle = svg.append('circle')
    .attr('class', 'flow-circle')
    .attr('r', Math.min(10, 4 + flow.bytes / 4096))
    .attr('fill', '#4a9eff')
    .attr('opacity', 1)
    .attr('cx', src.x)
    .attr('cy', src.y);

  circle.transition()
    .duration(800)
    .ease(d3.easeCubicInOut)
    .attr('cx', dst.x)
    .attr('cy', dst.y)
    .attr('opacity', 1)
    .transition()
    .duration(200)
    .attr('opacity', 0)
    .remove();
}

// store occupancy for tooltip
const smState = {};

function updateGauges(smStats) {
  smStats.forEach(stat => {
    const gauge = smGauges[stat.id];
    if (!gauge) return;
    const width = stat.occupancy * smBlockW;
    gauge.attr('width', width)
          .attr('fill', d3.interpolateBlues(stat.occupancy))
          .attr('stroke', stat.stall_pct > 40 ? '#ff6b6b' : 'none');
    smState[stat.id] = {occupancy: stat.occupancy, stall: stat.stall_pct};
  });
}

// Tooltip events on SM blocks
svg.selectAll('.sm-block')
  .on('mouseover', (event, d) => {
    const idNum = d; // datum is id
    const occ = (smState[idNum]?.occupancy ?? 0) * 100;
    const stall = smState[idNum]?.stall ?? 0;
    tooltip.html(`<strong>SM${idNum}</strong><br>Occupancy: ${occ.toFixed(0)}%<br>Stall: ${stall.toFixed(0)}%`)
           .style('opacity', 1);
  })
  .on('mousemove', (event) => {
    tooltip.style('left', event.pageX + 12 + 'px')
           .style('top', event.pageY + 12 + 'px');
  })
  .on('mouseout', () => tooltip.style('opacity', 0));

function tickFrame() {
  if (!isAnimating || frames.length === 0) return;
  const frame = frames[frameIdx % frames.length];
  updateGauges(frame.sm_stats);
  frame.flows.forEach(animateFlow);
  frameIdx += 1;
}

let timer;
function restartTimer() {
  if (timer) timer.stop();
  timer = d3.interval(tickFrame, speedMs);
}

function startAnimation() {
  restartTimer();
}

// Load synthetic trace and kick off animation
d3.json('data/synthetic_trace.json').then(data => {
  if (Array.isArray(data) && data.length && data[0].src) {
    // old flow-only format, wrap into frames
    frames = data.map((f,i)=>({
      sm_stats: d3.range(8).map(id=>({id, occupancy: Math.random(), stall_pct: 0})),
      flows: [f]
    }));
  } else {
    frames = data;
  }
  startAnimation();
  console.log('Frames:', frames.length);
}).catch(err => {
  console.error('Trace load failed', err);
  // generate random frames
  frames = d3.range(120).map(i=>({
    sm_stats: d3.range(8).map(id=>({id, occupancy: Math.random(), stall_pct: 0})),
    flows: d3.range(4).map(()=>({
      src:`SM${Math.floor(Math.random()*8)}`,
      dst:`DRAM${Math.floor(Math.random()*2)}`,
      type:'load',
      bytes:1024+Math.random()*8192
    }))
  }));
  startAnimation();
});

updateLayerVisibility(); // initial

// Controls - Explain button
const explainBtn = controlsDiv.append('button').attr('class','btn').text('Explain');

explainBtn.on('click', () => {
  isAnimating = false;
  playBtn.text('Play');
  showOverlay();
});

function showOverlay() {
  const overlay = d3.select('body').append('div').attr('class','overlay');
  const oc = overlay.append('div').attr('class','overlay-content');
  oc.html(`<h3>What you are seeing</h3>
    <p><span style="color:#4a9eff">Blue pulses</span> represent memory load transactions travelling from Streaming Multiprocessors (SMs) through cache to DRAM.<br>
    The <span style="color:${d3.interpolateBlues(0.8)}">blue bars</span> on each SM show active warp occupancy.<br>
    A <span style="color:#ff6b6b">red outline</span> indicates the SM is heavily stalled (&gt;40%).</p>`);
  oc.append('button').attr('class','btn').text('Close').on('click',()=>{
    overlay.remove();
    isAnimating = true;
    playBtn.text('Pause');
  });
}

console.log("GPU floor-plan rendered. Size:", W, "x", H);
