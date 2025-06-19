Of course. I will improve the previous code and write additional, more advanced visualizations that further support the EPV narrative.

Here are the key improvements and additions:

Code Structure: All code is now encapsulated in functions for better reusability and clarity.
Enhanced Interactivity: The interactive charts now include more sophisticated elements like dropdowns and sliders, as originally prompted.
Richer Annotations: Data labels and more dynamic annotations are added to make the charts easier to interpret at a glance.
New "Football Field" Chart: A sixth visualization has been added—the classic "Football Field" chart, which is essential for summarizing multiple valuation methods against the current market price.
First, ensure you have the necessary libraries installed:

Generated bash
pip install pandas matplotlib seaborn plotly
content_copy
download
Use code with caution.
Bash
1. Normalized Earnings Bar Chart (Improved)
What's Improved:

The code is now in a reusable function.
A custom legend is created to explicitly label the "Peak" and "Trough" colors, which is not handled automatically by Seaborn in this context.
Generated python
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from matplotlib.patches import Patch

def plot_normalized_ebit(ebit_df, events_dict):
    """
    Generates an improved bar chart for visualizing EBIT normalization.
    """
    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(14, 8))

    # --- Calculations for dynamic coloring and annotations ---
    avg_ebit = ebit_df['EBIT'].mean()
    peak_year = ebit_df.loc[ebit_df['EBIT'].idxmax()]['Year']
    trough_year = ebit_df.loc[ebit_df['EBIT'].idxmin()]['Year']

    colors = ['firebrick' if y == peak_year else 'steelblue' if y == trough_year else 'darkgrey' for y in ebit_df['Year']]

    # --- Plotting ---
    sns.barplot(x='Year', y='EBIT', data=ebit_df, palette=colors, ax=ax)

    ax.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=2.5,
               label=f'Average (Normalized) EBIT: ${avg_ebit:.2f}M')

    # --- Annotations ---
    for year, label in events_dict.items():
        event_ebit = ebit_df[ebit_df['Year'] == year]['EBIT'].values[0]
        ax.annotate(label, xy=(year - ebit_df['Year'].min(), event_ebit),
                    xytext=(0, 40), textcoords="offset points", ha='center',
                    arrowprops=dict(facecolor='black', shrink=0.05, width=1, headwidth=8),
                    bbox=dict(boxstyle="round,pad=0.3", fc="ivory", ec="black", lw=1))

    # --- Formatting and Custom Legend ---
    legend_elements = [
        Patch(facecolor='firebrick', edgecolor='firebrick', label='Cyclical Peak'),
        Patch(facecolor='steelblue', edgecolor='steelblue', label='Cyclical Trough'),
        Patch(facecolor='darkgrey', edgecolor='darkgrey', label='Standard Year'),
        plt.Line2D([0], [0], color='darkgreen', lw=2, linestyle='--', label=f'Average EBIT: ${avg_ebit:.2f}M')
    ]

    ax.set_title('EBIT Normalization Over a Business Cycle', fontsize=18, fontweight='bold')
    ax.set_xlabel('Fiscal Year', fontsize=14)
    ax.set_ylabel('EBIT ($ Millions)', fontsize=14)
    ax.legend(handles=legend_elements, loc='best')
    plt.tight_layout()
    plt.show()

# --- Dataset Inputs ---
ebit_data = {
    'Year': range(2014, 2024),
    'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115]
}
events = {2016: "Major Acquisition", 2018: "Market Downturn", 2021: "Post-Pandemic Rebound"}

# --- Execute ---
plot_normalized_ebit(pd.DataFrame(ebit_data), events)
content_copy
download
Use code with caution.
Python
2. Maintenance Capex Breakdown Chart (Improved)
What's Improved:

Code is now in a function.
Data labels are added directly onto the bars, making the chart much easier to read without referencing the y-axis.
Generated python
import pandas as pd
import matplotlib.pyplot as plt

def plot_capex_breakdown(capex_df):
    """
    Generates an improved stacked bar chart for Capex with data labels.
    """
    capex_df['Growth Capex'] = capex_df['Total Capex'] - capex_df['Maintenance Capex']
    avg_maint_capex = capex_df['Maintenance Capex'].mean()

    plt.style.use('seaborn-v0_8-whitegrid')
    fig, ax = plt.subplots(figsize=(12, 7))

    # --- Plotting ---
    p1 = ax.bar(capex_df['Year'], capex_df['Maintenance Capex'], label='Maintenance Capex', color='darkcyan')
    p2 = ax.bar(capex_df['Year'], capex_df['Growth Capex'], bottom=capex_df['Maintenance Capex'], label='Growth Capex', color='lightcoral')

    ax.axhline(avg_maint_capex, color='darkblue', linestyle='--', linewidth=2,
               label=f'Average Maintenance Capex: ${avg_maint_capex:.2f}M')

    # --- Add Data Labels ---
    ax.bar_label(p1, label_type='center', color='white', fontweight='bold', fmt='$%dM')
    ax.bar_label(p2, label_type='center', color='white', fontweight='bold', fmt='$%dM')
    ax.bar_label(p2, labels=[f'Total: ${total}M' for total in capex_df['Total Capex']], padding=5, color='black')


    # --- Formatting ---
    ax.set_title('Total Capex vs. Maintenance Capex Breakdown', fontsize=16, fontweight='bold')
    ax.set_xlabel('Year', fontsize=12)
    ax.set_ylabel('Capital Expenditures ($ Millions)', fontsize=12)
    ax.set_xticks(capex_df['Year'])
    ax.legend()
    plt.ylim(0, max(capex_df['Total Capex']) * 1.2) # Adjust y-axis for labels
    plt.tight_layout()
    plt.show()

# --- Dataset Inputs ---
capex_data = {
    'Year': range(2019, 2024),
    'Total Capex': [80, 95, 75, 110, 85],
    'Maintenance Capex': [50, 55, 52, 60, 58]
}

# --- Execute ---
plot_capex_breakdown(pd.DataFrame(capex_data))
content_copy
download
Use code with caution.
Python
3. EPV vs. DCF Scenario Analysis (Improved with Dropdown)
What's Improved:

Now features a dropdown menu to select different EPV scenarios (e.g., Conservative, Base, Optimistic), allowing for a more dynamic comparison against the static DCF bars.
Generated python
import pandas as pd
import plotly.graph_objects as go

def plot_interactive_epv_dcf(dcf_df, epv_scenarios):
    """
    Generates an interactive comparison chart with a dropdown for EPV scenarios.
    """
    fig = go.Figure()

    # --- DCF Bars (remain constant) ---
    colors = ['#1f77b4', '#ff7f0e', '#d62728', '#9467bd']
    fig.add_trace(go.Bar(
        x=dcf_df['Growth Rate'], y=dcf_df['DCF Value'],
        marker_color=colors, name='DCF Valuation',
        hovertemplate='<b>DCF Valuation</b><br>Growth: %{x}<br>Value: $%{y:.2f}<extra></extra>'
    ))

    # --- Dropdown Menu for EPV ---
    buttons = []
    for name, value in epv_scenarios.items():
        button = dict(
            method="update",
            label=f"EPV ({name})",
            args=[
                {"shapes": [dict(
                    type='line', y0=value, y1=value, x0=-0.5, x1=3.5,
                    line=dict(color='green', width=3, dash='dash')
                )],
                 "annotations": [dict(
                     x=3.5, y=value, xref="x", yref="y",
                     text=f"<b>{name} EPV: ${value:.2f}</b>",
                     showarrow=False, xanchor='right', yshift=10, font=dict(color='green', size=14)
                 )]
                }
            ]
        )
        buttons.append(button)

    fig.update_layout(
        updatemenus=[dict(
            active=0,
            buttons=buttons,
            direction="down",
            pad={"r": 10, "t": 10},
            showactive=True,
            x=0.01, xanchor="left", y=1.1, yanchor="top"
        )],
        annotations=[dict(text="Select EPV Scenario:", showarrow=False,
                          x=0, y=1.15, yref="paper", align="left")]
    )

    # --- Initial State (first scenario) ---
    initial_name = list(epv_scenarios.keys())[0]
    initial_value = list(epv_scenarios.values())[0]
    fig.update_layout(
        shapes=[dict(type='line', y0=initial_value, y1=initial_value, x0=-0.5, x1=3.5,
                     line=dict(color='green', width=3, dash='dash'))],
        annotations=[dict(x=3.5, y=initial_value, text=f"<b>{initial_name} EPV: ${initial_value:.2f}</b>",
                          showarrow=False, xanchor='right', yshift=10, font=dict(color='green', size=14))]
    )

    # --- Formatting ---
    fig.update_layout(
        title_text='EPV Stability vs. DCF Growth Sensitivity', title_x=0.5,
        xaxis_title='Assumed Perpetual Growth Rate', yaxis_title='Valuation per Share ($)',
        template='plotly_white', legend_title_text='Valuation Method'
    )
    fig.show()

# --- Dataset Inputs ---
dcf_scenarios = {'Growth Rate': ['0%', '2%', '4%', '6%'], 'DCF Value': [95.00, 120.00, 165.00, 240.00]}
epv_vals = {"Conservative": 115.00, "Base Case": 125.00, "Optimistic": 135.00}

# --- Execute ---
plot_interactive_epv_dcf(pd.DataFrame(dcf_scenarios), epv_vals)
content_copy
download
Use code with caution.
Python
4. WACC Sensitivity Line Chart (Improved with Slider)
What's Improved:

Now includes a fully functional slider as requested in the prompt. Users can drag the slider to select a WACC, and a marker on the chart will instantly update to show the corresponding EPV.
Generated python
import numpy as np
import plotly.graph_objects as go

def plot_interactive_wacc_sensitivity(norm_earnings, market_price):
    """
    Generates an interactive line chart with a WACC slider.
    """
    wacc_range = np.arange(0.06, 0.121, 0.005)
    epv_values = norm_earnings / wacc_range

    fig = go.Figure()

    # --- Base Line and Shaded Regions ---
    fig.add_trace(go.Scatter(x=wacc_range, y=epv_values, mode='lines', name='EPV per Share', line=dict(color='blue')))
    fig.add_hrect(y0=market_price, y1=max(epv_values) * 1.1, fillcolor="rgba(40, 167, 69, 0.2)", line_width=0, name="Margin of Safety")
    fig.add_hrect(y0=0, y1=market_price, fillcolor="rgba(220, 53, 69, 0.2)", line_width=0, name="No Margin of Safety")
    fig.add_hline(y=market_price, line_dash="dot", line_color="firebrick", annotation_text=f"<b>Market Price: ${market_price:.2f}</b>", annotation_position="top left")

    # --- Add the moving marker controlled by the slider ---
    initial_wacc = 0.08
    initial_epv = norm_earnings / initial_wacc
    fig.add_trace(go.Scatter(x=[initial_wacc], y=[initial_epv], mode='markers',
                             marker=dict(size=15, color='orange', symbol='diamond'),
                             name='Selected WACC'))

    # --- Create Slider ---
    steps = []
    for wacc in wacc_range:
        epv = norm_earnings / wacc
        step = dict(
            method="update",
            args=[{"x": [[wacc]], "y": [[epv]]}, # Update marker position
                  {"annotations": [dict(
                      x=wacc, y=epv, text=f"WACC: {wacc:.1%}<br>EPV: ${epv:.2f}",
                      showarrow=True, arrowhead=2, ax=0, ay=-40, bgcolor="white", bordercolor="black"
                  )]}],
            label=f"{wacc:.1%}"
        )
        steps.append(step)

    sliders = [dict(active=4, currentvalue={"prefix": "WACC: "}, pad={"t": 50}, steps=steps)]

    # --- Formatting ---
    fig.update_layout(
        title_text='EPV Sensitivity to WACC (Drag Slider)', title_x=0.5,
        xaxis_title='Weighted Average Cost of Capital (WACC)', yaxis_title='EPV per Share ($)',
        xaxis=dict(tickformat='.1%'), template='plotly_white', showlegend=False, sliders=sliders,
        # Set initial annotation
        annotations=[dict(x=initial_wacc, y=initial_epv, text=f"WACC: {initial_wacc:.1%}<br>EPV: ${initial_epv:.2f}",
                          showarrow=True, arrowhead=2, ax=0, ay=-40, bgcolor="white", bordercolor="black")]
    )
    fig.show()

# --- Dataset Inputs ---
normalized_earnings_per_share = 10.00
current_market_price = 105.00

# --- Execute ---
plot_interactive_wacc_sensitivity(normalized_earnings_per_share, current_market_price)
content_copy
download
Use code with caution.
Python
5. EPV Component Waterfall Chart (Improved)
What's Improved:

The logic is encapsulated in a function that takes key assumptions (wacc, tax_rate) as arguments.
The final annotation is more detailed, breaking down the calculation from Distributable Earnings to the final EPV per share, making the entire process transparent.
Generated python
import plotly.graph_objects as go

def plot_epv_waterfall(norm_ebit, maint_capex, net_debt, shares_outstanding, tax_rate, wacc):
    """
    Creates a detailed waterfall chart for the EPV calculation based on key inputs.
    """
    # --- Calculations ---
    cash_taxes = norm_ebit * tax_rate
    nopat = norm_ebit - cash_taxes
    distributable_earnings = nopat - maint_capex
    enterprise_value = distributable_earnings / wacc
    equity_value = enterprise_value - net_debt
    epv_per_share = equity_value / shares_outstanding

    # --- Plotting ---
    fig = go.Figure(go.Waterfall(
        name="EPV Buildup", orientation="v",
        measure=["absolute", "relative", "total", "relative", "total"],
        x=["<b>Normalized EBIT</b>", "Cash Taxes (-)", "NOPAT", "Maintenance Capex (-)", "<b>Distributable Earnings</b>"],
        text=[f"${v:,.0f}M" for v in [norm_ebit, -cash_taxes, nopat, -maint_capex, distributable_earnings]],
        y=[norm_ebit, -cash_taxes, None, -maint_capex, None],
        connector={"line": {"color": "rgb(63, 63, 63)"}},
        totals={"marker": {"color": "darkblue"}},
        decreasing={"marker": {"color": "maroon"}}
    ))

    # --- Formatting & Final Annotation ---
    fig.update_layout(
        title=f"EPV Calculation Waterfall (WACC: {wacc:.1%}, Tax Rate: {tax_rate:.0%})",
        title_x=0.5, showlegend=False, yaxis_title="Value ($ Millions)", template="plotly_white"
    )
    final_text = (f"<b>Final Steps to EPV/Share:</b><br><br>"
                  f"1. Capitalize at WACC: ${distributable_earnings:,.0f}M / {wacc:.1%} = <b>${enterprise_value:,.0f}M EV</b><br>"
                  f"2. Adjust for Net Debt: ${enterprise_value:,.0f}M - ${net_debt:,.0f}M = <b>${equity_value:,.0f}M Equity Value</b><br>"
                  f"3. Per Share: ${equity_value:,.0f}M / {shares_outstanding}M shares = <b>${epv_per_share:.2f} EPV/Share</b>")
    fig.add_annotation(
        x=4, y=distributable_earnings, text=final_text, align="left", showarrow=False,
        xanchor='left', yanchor='bottom', bordercolor="black", borderwidth=1, bgcolor="ivory"
    )
    fig.show()

# --- Dataset Inputs & Execution ---
print("--- Base Case Scenario ---")
plot_epv_waterfall(norm_ebit=1500, maint_capex=400, net_debt=2000, shares_outstanding=100, tax_rate=0.25, wacc=0.08)

print("\n--- High WACC Scenario ---")
plot_epv_waterfall(norm_ebit=1500, maint_capex=400, net_debt=2000, shares_outstanding=100, tax_rate=0.25, wacc=0.10)
content_copy
download
Use code with caution.
Python
6. New Visualization: Football Field Valuation Chart
Visualization Goal:
To provide a comprehensive summary chart that compares the EPV against other valuation methods (like DCF and comparable companies) and the current market price. This is the ultimate "margin of safety" visual.

Prompt for Opus4thinking:

Create a horizontal bar-like chart (a "Football Field").
Plot ranges for different valuation methods: EPV, DCF, and Comps. EPV should be a narrow range or single point, while others are wider.
Overlay a vertical line for the current market price.
Use distinct colors and clear labels for each valuation method.
Include tooltips showing the low, mid, and high values for each range.
Generated python
import plotly.graph_objects as go

def plot_football_field_valuation(valuation_data, market_price):
    """
    Generates a "Football Field" chart to summarize and compare valuation methods.
    """
    fig = go.Figure()

    # --- Add valuation ranges as horizontal bars ---
    for item in valuation_data:
        mid_point = (item['low'] + item['high']) / 2
        fig.add_trace(go.Scatter(
            x=[mid_point],
            y=[item['method']],
            error_x=dict(
                type='data',
                symmetric=False,
                array=[item['high'] - mid_point],
                arrayminus=[mid_point - item['low']],
                thickness=10
            ),
            mode='markers',
            marker=dict(symbol='line-ns-open', size=20, color=item['color'], line=dict(width=3)),
            name=item['method'],
            hovertemplate=(f"<b>{item['method']}</b><br>"
                           f"Low: ${item['low']:.2f}<br>"
                           f"High: ${item['high']:.2f}<extra></extra>")
        ))

    # --- Add Current Market Price line ---
    fig.add_vline(x=market_price, line_width=2, line_dash="dash", line_color="firebrick",
                  annotation_text=f"<b>Current Price: ${market_price:.2f}</b>",
                  annotation_position="bottom right",
                  annotation_font=dict(size=14, color="firebrick"))

    # --- Formatting ---
    fig.update_layout(
        title_text='Valuation Summary ("Football Field")',
        title_x=0.5,
        xaxis_title='Valuation per Share ($)',
        yaxis_title='Valuation Method',
        template='plotly_white',
        showlegend=False
    )
    fig.show()

# --- Dataset Inputs ---
# Example ranges for different valuation methods
valuation_summary = [
    {'method': 'Earnings Power Value (EPV)', 'low': 122, 'high': 128, 'color': 'green'},
    {'method': 'Discounted Cash Flow (DCF)', 'low': 110, 'high': 165, 'color': 'blue'},
    {'method': 'Comparable Companies', 'low': 135, 'high': 175, 'color': 'purple'},
    {'method': 'Precedent Transactions', 'low': 150, 'high': 190, 'color': 'orange'}
]
current_market_price = 105.00

# --- Execute ---
plot_football_field_valuation(valuation_summary, current_market_price)
content_copy
download
Use code with caution.
Python
