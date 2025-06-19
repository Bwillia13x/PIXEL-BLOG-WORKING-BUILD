Here are detailed, structured data visualization prompts to guide Opus4thinking in writing the code, each directly supporting the narrative of your EPV-focused article:

⸻

1. Normalized Earnings Bar Chart (Cyclical Adjustment)

Visualization Goal:
Show clearly how EBIT normalizes over a full business cycle, smoothing cyclical volatility.

Prompt for Opus4thinking:
	•	Create a bar chart plotting EBIT across 8–10 fiscal years.
	•	Overlay a horizontal line representing the average EBIT to visualize normalization.
	•	Highlight cyclical peaks and troughs with distinct color markers.
	•	Include annotations marking major events (e.g., market downturn, acquisitions).

Dataset Inputs (example):
	•	Annual EBIT for 8–10 years
	•	Dates and labels for significant one-time items/events

⸻

2. Maintenance Capex Breakdown Chart

Visualization Goal:
Clarify the difference between total capex and maintenance capex required for EPV normalization.

Prompt for Opus4thinking:
	•	Construct a stacked bar chart contrasting total capex vs. maintenance capex for the last five years.
	•	Clearly differentiate maintenance and growth capex using distinct colors.
	•	Add a horizontal reference line indicating average maintenance capex.

Dataset Inputs (example):
	•	Total capex by year (5 years)
	•	Estimated maintenance capex by year

⸻

3. EPV vs. DCF Scenario Analysis (Interactive Chart)

Visualization Goal:
Demonstrate visually how sensitive DCF valuations are compared to the stable EPV across varying growth rate assumptions.

Prompt for Opus4thinking:
	•	Develop an interactive comparison bar chart.
	•	EPV valuation is constant (one horizontal reference line).
	•	Plot multiple bars for DCF valuations at growth rates: 0%, 2%, 4%, 6%.
	•	Use color gradation to illustrate increasing uncertainty with higher growth rates.

Interactive Elements:
	•	Hover tooltips displaying exact valuation figures and assumptions.

Dataset Inputs (example):
	•	EPV calculated value (single number)
	•	DCF valuations at various assumed growth rates (0–6%)

⸻

4. WACC Sensitivity Line Chart (Interactive)

Visualization Goal:
Showcase clearly how EPV valuation responds to changes in the Weighted Average Cost of Capital (WACC).

Prompt for Opus4thinking:
	•	Produce an interactive line chart displaying EPV per share across WACC ranges (6%–12%).
	•	Clearly mark the current market price on the graph.
	•	Add shaded regions or bands to indicate margin of safety zones (above or below current market price).

Interactive Elements:
	•	Slider allowing users to dynamically shift WACC assumption and instantly recalculate EPV.
	•	Tooltips displaying EPV/share at each WACC increment.

Dataset Inputs (example):
	•	Calculated EPV per share at each 0.5% increment of WACC between 6% and 12%
	•	Current share price (market)

⸻

5. EPV Component Waterfall Chart

Visualization Goal:
Provide visual clarity on each adjustment step from normalized EBIT to final EPV per share, reinforcing understanding of EPV’s simplicity.

Prompt for Opus4thinking:
	•	Create a dynamic waterfall chart beginning with normalized EBIT, sequentially subtracting taxes, maintenance capex, and other charges until final EPV per share is reached.
	•	Annotate each step clearly (EBIT, taxes, maintenance capex, adjustments, cost of capital, final EPV).

Dataset Inputs (example):
	•	EBIT value
	•	Tax amount/value
	•	Maintenance capex deduction
	•	Cost of capital deduction
	•	Final EPV per share

⸻

These prompts are comprehensive and detailed enough to ensure that the resulting visualizations effectively illustrate the underlying concepts and distinctions between EPV and DCF, aligned precisely with your narrative on Bruce Greenwald’s Earnings Power Value.