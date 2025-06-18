---
title: "FNCE 451 Cheatsheet"
date: "2025-06-17"
excerpt: "A two-page solution strategy guide for finance students."
category: "Education"
tags: ["Finance", "Education", "CheatSheet", "StudyGuide"]
readTime: "6 min read"
published: true
---

Finance courses can be daunting, with their myriad formulas, concepts, and problem types. FNCE 451 – an intermediate Corporate Finance course – is no exception. Students often face a blur of present values, cost of capital calculations, ratio analyses, and more on exams. To cut through this complexity, we present the FNCE 451 Cheatsheet, a concise two-page guide that distills the course's key problem-solving strategies and formulas. This isn't just a formula sheet; it's a strategic roadmap for tackling common finance problems, from capital budgeting to capital structure. In this article, we expand on the cheatsheet's contents, explaining each section's tips and how to apply them under exam conditions. Think of it as your finance GPS – guiding you step-by-step on each type of problem so you don't get lost in the numbers.

## 1. Time Value of Money & Cash Flow Basics

At the heart of corporate finance is the concept of Time Value of Money (TVM). The cheatsheet begins with a quick refresher:

- **Present Value (PV)** of a future cash flow: PV = CF/(1+r)^t. This formula is your go-to whenever you need to bring money from the future to today's terms. Remember to align t (number of periods) with r (rate per period). **Strategy**: Identify whether cash flows are annual, semi-annual, etc., and use the corresponding rate (e.g., if 6% annual and semi-annual periods, use 3% per period).

- **Future Value (FV)** and compounding: FV = CF × (1+r)^t. Often in FNCE 451, you'll use this in reverse (i.e., discounting to PV), but it's helpful when cross-checking growth of an investment or for multi-step problems.

- **Annuities and Perpetuities**: Key formulas included (annuity PV = C[1-(1+r)^-n]/r; perpetuity PV = C/r). **Strategy**: When faced with a series of cash flows, see if it fits an annuity pattern (equal payments each period) or a growing annuity/perpetuity. The cheatsheet reminds you of special cases like growing perpetuity PV = C₁/(r-g) (used e.g. in stock dividend valuation or terminal value in DCF). It also cautions: these formulas assume the first cash flow occurs one period from now; adjust if it's immediate.

**Common Pitfall**: Mixing up when to use which formula. The guide suggests a simple decision flow – Is it a single cash flow? Use basic PV/FV. Is it a uniform series? Use annuity formulas. Does it last indefinitely? Think perpetuity. Marking up timelines on scratch paper and labeling cash flows can prevent mistakes in selecting the formula.

## 2. Capital Budgeting and NPV

Capital budgeting questions ask: should a project or investment be undertaken? The Net Present Value (NPV) rule is central: Accept projects with NPV > 0. The cheatsheet outlines a solution approach for NPV problems:

### Step-by-Step NPV Approach

**Step 1: Identify Initial Outlay and Timing**: Typically at time 0, include all relevant costs (purchase, installation, increase in working capital). The cheat sheet reminds: if working capital is required, it's an outflow at start and will be recovered at end of project (inflow).

**Step 2: Forecast Cash Flows**: Operating cash flow each year = after-tax profit + depreciation – but the cheat sheet gives a quick formula: OCF = (Revenue - Costs - Depreciation) × (1-T) + Depreciation. This simplifies to OCF = (Revenue - Costs) × (1-T) + T × Depreciation – essentially after-tax income plus the tax shield on depreciation. It's a handy way to compute yearly cash flows for projects. **Strategy**: use this to avoid forgetting the tax shield or subtracting depreciation incorrectly.

**Step 3: Include Terminal Cash Flows**: e.g., salvage value of equipment (after tax, account for any gain/loss vs book value) and return of net working capital. The cheat sheet bullet points: Salvage After-tax = Sale price - T(Sale price - Book value). If sale price is below book, this becomes a tax credit.

**Step 4: Discount at appropriate cost of capital**: Use the project's risk-adjusted discount rate (often given as WACC for a typical project, or a rate reflecting project risk). The cheat sheet highlights: ensure you use after-tax WACC for NPV of free cash flows, which is normally provided or computed.

**Step 5: Decision**: if NPV ≥ 0, accept. If comparing mutually exclusive projects, choose the highest NPV.

Additionally, the guide provides quick reference to related metrics:

- **IRR (Internal Rate of Return)**: the discount rate that sets NPV=0. Tip: Use the cash flow sign pattern to guess IRR range, and cautions that IRR can be misleading for non-conventional cash flows or mutually exclusive choices (hence NPV is primary).
- **Payback Period**: easy formula if uniform cash flows = initial investment / annual cash flow. But normally, use cumulative approach. The cheat sheet just notes: Payback = time to recover initial outlay (no discounting) – included for completeness but reminds that it ignores time value and risk, so mainly a secondary criterion.

## 3. Cost of Capital and Capital Structure

This section is a lifesaver for problems on WACC and financing:

### Cost Components

- **Cost of Equity (r_e)**: The cheatsheet lists CAPM formula: r_e = r_f + β(E(R_m) - r_f). It also mentions if given, you could use DCF approach for a stable firm: r_e ≈ D₁/P₀ + g (dividend yield + growth) if a dividend growth model context comes up.

- **Cost of Debt (r_d)**: Usually given as yield or can be derived from interest expense/price. Remember to use after-tax cost of debt = r_d(1-T) because interest is tax-deductible. The cheat sheet bolds this as students often forget the tax shield in WACC.

- **WACC Formula**: Provided clearly so you can plug numbers in. **Strategy**: Check that you're using market values of equity and debt for weights (the guide reminds that book vs market can differ; use market cap for E, current debt market value or book as proxy if needed).

### Capital Structure Concepts

This portion of the cheat sheet summarizes MM theory (Modigliani-Miller). Key points: under no taxes, capital structure doesn't affect value (V = D + E constant); with corporate taxes, value increases with debt (tax shield = T*D). It lists the formula for value of levered firm: V_L = V_U + T_c D. Also, the effect on WACC: WACC decreases as debt increases (due to tax shield) up to a point.

The guide also lists the Hamada equation for adjusting beta with leverage: β_L = β_U[1 + D/E(1-T)]. Students can use this to unlever or relever betas in case a problem asks for project beta or a target capital structure scenario.

**Strategy tip for exams**: If a question gives a current WACC and asks what happens if debt increases, quickly recall: more debt → higher cost of equity (due to risk) and higher risk of bankruptcy costs, but tax shield lowers WACC initially. The cheat sheet likely notes the trade-off theory in a sentence: optimal structure where marginal tax benefit = marginal financial distress cost.

## 4. Financial Statements and Ratios

Finance exams often include analyzing a firm's financial health or performance:

### Key Ratios

The cheat sheet picks out the must-know ratios:
- **Liquidity**: Current Ratio, Quick Ratio
- **Leverage**: Debt/Equity, Interest Coverage = EBIT/Interest
- **Profitability**: Net Profit Margin, ROA, ROE
- **Efficiency**: Asset Turnover, Inventory Turnover, Receivables Period

Each is given by formula. For example, ROE = Net Income / Equity; Interest Coverage = EBIT / Interest Expense, etc.

### DuPont Breakdown

It reminds how ROE = (Net Profit Margin) × (Asset Turnover) × (Equity Multiplier). **Strategy**: Use this to pinpoint if ROE changes are from operational efficiency, margin, or leverage changes.

If provided with financial statements, the guide suggests: first common-size them (express items as % of sales for income statement, % of assets for balance sheet) to spot trends easily.

**Working Capital Calculation**: given the frequency of questions requiring computing operating cash flow adjustments, a quick formula for change in net working capital = change in (CA - CL) (excluding cash and debt) is included.

## 5. Bonds and Stock Valuation

Though FNCE 451 is corporate finance, understanding bond pricing and stock valuation is essential:

### Bond Pricing

The cheatsheet condenses this to: Price = Present value of coupons + Present value of face value. If semiannual, remember to halve rate and double periods. It includes the formula for yield to maturity conceptually, and notes relationships: If coupon < YTM, bond sells at discount; if coupon > YTM, premium.

### Stock Valuation

It gives the Dividend Discount Model (DDM) for constant growth: P₀ = D₁/(r_e - g). Also perhaps a note on no-growth (like a perpetuity P = D/r) and multi-stage if relevant (though likely not heavily in 451).

**Comparables**: Reminds that stock value can be estimated by multiples (P/E ratio approach). Quick strategy: Value = (P/E of peer) × (Earnings of company). Also mention EV/EBITDA for firm value comparisons.

## 6. Putting It All Together – Strategy for Problem Solving

The second page likely ends with a "How to approach the exam" mini-guide:

### Exam Strategy

1. **Read the question carefully**: Identify what is being asked – valuation? decision? numeric answer or explanation?

2. **Write down known values**: Underline or jot: r = ?, T = ?, etc.

3. **Choose the right formula or approach**: Use the cheat sheet sections to pick the formula. The sheet is organized in the same order as one might consider in a problem.

4. **Solve step by step**: The guide maybe uses a flow: e.g., For any valuation problem: 1) find cash flows, 2) find discount rate, 3) compute PV.

5. **Double-check units and reasonableness**: The cheat sheet encourages quick sanity checks. Example: if you compute an NPV and get an extremely large positive number relative to initial cost, does it make sense?

6. **Time management**: likely a note – don't spend too long on one part; if stuck, move and come back. Because with a cheatsheet, it's easier to get nudged in the right direction quickly.

## Conclusion

The FNCE 451 Cheatsheet condenses an entire course's worth of concepts into an easy reference. By focusing not just on formulas but on solution strategies, it helps students think through problems logically: identify problem type, recall the relevant formula (with it in front of them), plug in values carefully, and interpret the result. Mastery of finance is not about memorizing equations, but understanding which tools to use and how to apply them – this guide aims to build that mastery.

With this two-page guide by their side, finance students can approach their exams with confidence. Instead of panicking at the sight of a complex scenario, they can break it down using the structured approach from the cheatsheet. Ultimately, success in FNCE 451 (and finance in general) comes from practice and clear thinking; our cheatsheet is designed to reinforce both by providing clarity and reminding students of the logical steps. Armed with it, you'll be solving like a pro: from computing an optimal capital budget to evaluating a firm's financial health, all within the exam's time pressure.

*(Note: Always adhere to your course or exam's policy on reference sheets. This article expands on a hypothetical cheatsheet, which should be used ethically as a study aid.)* 