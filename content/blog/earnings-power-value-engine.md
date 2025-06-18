---
title: "Earnings-Power-Value Valuation Engine"
date: "2025-06-17"
excerpt: "A Python + Streamlit tool for automating EPV valuations."
category: "Finance"
tags: ["Finance", "Valuation", "Python", "Streamlit"]
readTime: "9 min read"
published: true
---

Valuing a company is as much art as science, but certain methods bring structure to the process. Earnings Power Value (EPV) is one such method, popularized by Professor Bruce Greenwald, which estimates a firm's intrinsic value based on the sustainable earnings it can generate without assuming any growth. In essence, EPV asks: if this company froze in its current state, what would its cash flows be worth? This article introduces an Earnings-Power-Value Valuation Engine – a Python and Streamlit-based web app that automates the EPV calculation for any publicly traded company. We will explain the EPV concept, walk through the features of the tool, and illustrate with an example how this engine can help analysts quickly gauge whether a stock is under- or over-valued based on its earnings power.

## Understanding Earnings Power Value (EPV)

EPV is rooted in a simple formula:

**EPV of Firm = Adjusted Earnings / Cost of Capital**

In other words, EPV capitalizes a company's current earnings (properly adjusted for one-time items and cyclicality) at the firm's weighted-average cost of capital (WACC). The result is the value of the company's operations assuming no future growth – effectively treating current earnings as perpetually sustainable. To get to EPV Equity, one would then add excess net assets (like surplus cash or investment holdings) and subtract debt.

The rationale behind EPV is to estimate what a business is worth based on what it's earning right now, rather than speculative forecasts. If the stock's market price is significantly below EPV, the firm might be undervalued (assuming current earnings are indeed sustainable); if above, it might be overvalued barring growth not yet reflected.

### Key Steps in EPV Calculation

1. **Determine Adjusted Earnings**: Start with operating earnings (EBIT) and normalize them. This often involves taking an average EBIT margin over a business cycle (say 5–7 years) and multiplying by current revenues to get a "steady-state" EBIT. Then adjust for taxes (use a normal tax rate on EBIT). Add back any under-reported earnings due to accounting conventions, such as excessive depreciation – for example, add back half of the difference between economic depreciation and accounting depreciation (after-tax). Also adjust for any extraordinary items that shouldn't recur, and for investments in unconsolidated subsidiaries, etc., to get a clean, sustainable net operating profit after tax.

2. **Compute WACC**: Calculate the firm's cost of capital as the blended rate of return required by equity investors and debt holders. WACC is typically r_e × E/V + r_d × (1-T) × D/V, where r_e is cost of equity, r_d cost of debt, E/V the equity portion of total value, D/V debt portion, and T the tax rate. Our EPV engine fetches or allows input for the company's capital structure and uses models like CAPM to estimate r_e (based on beta, risk-free rate, equity risk premium) and uses credit ratings or interest expense analysis for r_d.

3. **Calculate EPV (Operations)**: Divide the adjusted earnings (step 1) by WACC (step 2). This yields the value of the operating business as if earnings have zero growth and continue indefinitely at that level.

4. **Account for Non-Operating Assets and Debt**: Finally, adjust for the balance sheet. Add excess cash or investments that aren't needed for operations (since EPV from operations assumes normal operation assets are already generating the earnings). Subtract any debt (since debt holders have claim on some value). The result is EPV Equity – the intrinsic equity value according to earnings power. On a per-share basis, divide by number of shares.

It's important to note what EPV ignores: future growth. By design, it sets growth to zero. This makes it a conservative valuation in growth industries (missing upside) but can also reveal when market prices are assuming growth that may not materialize. It's a useful benchmark and is often combined with asset-based valuations to cross-check assumptions.

## Overview of the EPV Valuation Engine

The EPV Valuation Engine is a web application built with Streamlit, a Python framework that makes it easy to create interactive apps for data analysis. The app integrates financial data retrieval (using libraries like yfinance or financial APIs) with an EPV model coded in Python.

### Features

- **Financial Data Import**: Users can input a stock ticker, and the app automatically fetches financial statements (income statement, balance sheet) and market data. It pulls several years of historical income statements to compute average margins and other normalization inputs.

- **Adjustments Interface**: The app presents a table of the company's recent EBIT margins, tax rates, depreciation, etc. It suggests a default normalized EBIT (for example, using an average margin over the past 5 years applied to last year's revenue). Users can tweak these values if they have insight (e.g., exclude an abnormal recession year, or use a different tax rate if future tax environment differs).

- **WACC Calculation Module**: The engine fetches the company's current capital structure (market cap for equity, total debt from balance sheet) and pre-fills values like the 10-year government bond yield (as risk-free rate). It estimates cost of equity via CAPM (with an option for the user to adjust beta or risk premium). It also estimates cost of debt (using either interest expense from the income statement or a default spread based on credit rating if available). The resulting WACC is displayed and can be overridden if, for instance, the user wants to see sensitivity (e.g., what if WACC were 10% vs 8%).

- **EPV Computation and Results**: With adjusted earnings and WACC determined, the app computes EPV (operations) = Adjusted Earnings / WACC. Then it adds excess cash and investments, subtracts debt, and divides by shares to get EPV per share. This is presented alongside the current stock price for comparison.

- **Sensitivity Analysis**: Because any valuation is sensitive to assumptions, the tool includes a slider or table to show how EPV per share changes with different WACC or different adjusted earnings. For example, it might show EPV under a range of WACC from 6% to 10%, or if margins were slightly higher or lower. This helps users see how robust the valuation is to assumption changes.

- **Visualization**: The app generates a simple chart – perhaps a bar graph – comparing the current market capitalization to the EPV of operations and EPV equity. This visual can highlight if the market is implying a lot of growth (market cap >> EPV) or if the market undervalues current earnings (market cap << EPV, indicating skepticism about sustainability or unrecognized assets).

### How It Works (Under the Hood)

The Python backend uses libraries like Pandas for data manipulation. For instance, upon entering a ticker, the app uses yfinance to download the last 5-10 years of income statements and the current balance sheet. It calculates historical EBIT margins (EBIT/Revenue) and perhaps displays them: "2018: 15%, 2019: 18%, 2020: 17%, 2021: 20%, 2022: 19%". If the business is stable, these might cluster, so using ~18% as a normalized margin makes sense. The app multiplies that by the latest revenue (2023) to get normalized EBIT. It then takes, say, the 2023 tax rate or an average tax rate to get after-tax earnings.

Depreciation adjustments: it looks at depreciation vs capital expenditures – the Investopedia guideline suggests adding back excess depreciation (half the difference between reported depreciation and maintenance capex, after tax). The app might simplify by assuming maintenance capex ~ depreciation for a mature firm, or let the user input a maintenance capex percentage.

Streamlit's framework allows these calculations to update in real time as the user moves sliders or inputs new values. The result is a user-friendly yet powerful tool that encapsulates quite a bit of financial theory.

## Example Case Study

Let's illustrate using a hypothetical example: XYZ Corp. Suppose XYZ is a relatively stable company in a mature industry:

- Recent revenue (2023) = $10 billion
- Average EBIT margin (past 5 yrs) = 15%. So normalized EBIT = 15% × $10B = $1.5B
- Assume a 25% tax rate (roughly the effective rate historically). After-tax normalized earnings = $1.125B
- The company has depreciation of $800M and capex of $750M (slightly lower, indicating they've been investing a bit less than depreciation). The model might add back a small portion of depreciation indicating not all depreciation is needed for maintenance. Let's say it adds back $50M after-tax.
- Thus, Adjusted Earnings ≈ $1.175B

Now, XYZ's capital:
- Market value of equity = $12B (stock price times shares)
- Debt = $3B
- Excess cash = $1B (beyond what's needed for operations)
- Thus E/V ~ 80%, D/V ~ 20% (enterprise value ~ $14B excluding excess cash)
- Cost of equity (using CAPM): Beta 1.1, risk-free 3.5%, equity risk premium 5%. So r_e = 3.5% + 1.1×5% = 9% (0.09)
- Cost of debt: average interest rate ~ 4.5%, after tax ~ 3.4%
- WACC = 0.8×9% + 0.2×3.4% = 7.72% (approx)

Using the engine, EPV (operations) = $1.175B / 0.0772 ≈ $15.22B. Then adding $1B excess cash gives $16.22B. Subtract debt $3B gives EPV equity = $13.22B. If shares are, say, 100 million, EPV per share = $132.2. If the current stock price is $120, the result suggests the stock is trading below EPV (potentially undervalued assuming earnings are sustainable). The ratio of market price/EPV would be 0.91x. If instead the stock were $150, that's above EPV (1.13x), indicating the market expects significant growth or perhaps the company has strong competitive advantages not fully captured by current earnings.

The app would display this outcome clearly, perhaps with a statement: "EPV per share: $132. Market price: $120. Conclusion: The market is pricing XYZ at 91% of its earnings power value, implying either the stock is undervalued or investors are skeptical that current earnings are sustainable long-term."

## Use Cases and Benefits

The EPV Valuation Engine is useful for:

### Value Investors
Who want a quick check if a company's current earnings justify its price without growth. It flags potentially undervalued stocks for deeper analysis.

### Finance Students
The tool is educational – it demonstrates how changes in cost of capital or profit margins affect valuation. Students in a finance class can input different scenarios and immediately see outcomes, reinforcing concepts like WACC or normalization.

### Corporate Strategists
Even companies themselves might use EPV to gauge how the market views them. If their stock consistently trades below EPV, it might suggest the market perceives weak competitive position (because EPV typically assumes average firms with no moat will only be worth EPV, whereas those with moats could be worth more as they can sustain high returns).

### What-If Analysis
An analyst can ask, "What does the market-implied EPV margin or WACC need to be?" For instance, the app could be inverted: input the stock price and solve for what adjusted earnings or WACC would equate price with EPV. If you find that the market price implies a much higher EBIT margin than the company ever achieved, that's a red flag (market possibly too optimistic). Our engine can facilitate such reverse engineering.

## Extending the Tool

Currently focused on EPV, the same platform could be extended to incorporate other valuation methods like Discounted Cash Flow (DCF) with growth, or Asset-based valuations (reproduction costs of assets, another Greenwald approach). We envision adding a toggle to switch between EPV and DCF models to compare a no-growth valuation with a growth-inclusive one.

We also plan to integrate the tool with a database of assumptions for different industries (since, for example, a stable utility company might warrant using a longer historical average and lower WACC, whereas a cyclical mining firm needs careful cycle adjustment).

## Conclusion

The Earnings-Power-Value Valuation Engine automates a rigorous valuation framework and makes it accessible with just a ticker input and a few clicks. By focusing on a company's normalized earnings and stripping away growth assumptions, EPV provides an anchor for value. Our Python/Streamlit implementation brings this analysis from the spreadsheet to the web app, allowing interactive exploration and quick scenario analysis.

In practice, EPV is often used in conjunction with other methods – it's not the final word on value but a very informative data point. This tool encourages better investment analysis by highlighting the relationship between earnings, risk (cost of capital), and value. It embodies the adage: "Value investing is about determining what a business is worth based on its current cash flows, and not overpaying even if rosy growth is expected." If a company's stock is below its EPV, investors might get growth for free. If it's above, buyers should be confident in the firm's competitive advantages that will sustain and grow earnings.

The EPV Valuation Engine thus serves as both a practical calculator and an educational guide. By automating the heavy lifting – data gathering and math – it lets users focus on understanding the business itself and testing assumptions. Whether you're a student, a professional analyst, or a curious investor, we invite you to try the app, play with the inputs, and see how this approach can add a sturdy pillar to your valuation analyses. 