#!/usr/bin/env python3
"""
ULTIMATE Enhanced EPV Implementation - Professional Suite
Comprehensive enhancement of all prompts_2.md visualizations
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from matplotlib.patches import Patch
import warnings
warnings.filterwarnings('ignore')

plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("Set2")

def create_enhanced_data():
    """Generate comprehensive datasets"""
    np.random.seed(42)
    
    # EBIT data
    ebit_data = {
        'Year': range(2014, 2024),
        'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115]
    }
    
    # Capex data 
    capex_data = {
        'Year': range(2019, 2024),
        'Total Capex': [80, 95, 75, 110, 85],
        'Maintenance Capex': [50, 55, 52, 60, 58]
    }
    
    # DCF scenarios
    dcf_data = {
        'Growth Rate': ['0%', '2%', '4%', '6%'],
        'DCF Value': [95.00, 120.00, 165.00, 240.00]
    }
    
    # EPV scenarios
    epv_scenarios = {"Conservative": 115.00, "Base Case": 125.00, "Optimistic": 135.00}
    
    # Events
    events = {2016: "Major Acquisition", 2018: "Market Downturn", 2021: "Post-Pandemic Rebound"}
    
    return ebit_data, capex_data, dcf_data, epv_scenarios, events

def plot_1_enhanced_ebit():
    """1. MASSIVELY Enhanced EBIT Normalization"""
    print("\n🎯 ENHANCED EBIT NORMALIZATION ANALYSIS...")
    
    ebit_data, _, _, _, events = create_enhanced_data()
    ebit_df = pd.DataFrame(ebit_data)
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 14))
    fig.suptitle('ENHANCED EBIT NORMALIZATION SUITE', fontsize=18, fontweight='bold')
    
    # Main enhanced chart
    avg_ebit = ebit_df['EBIT'].mean()
    std_ebit = ebit_df['EBIT'].std()
    peak_year = ebit_df.loc[ebit_df['EBIT'].idxmax(), 'Year']
    trough_year = ebit_df.loc[ebit_df['EBIT'].idxmin(), 'Year']
    
    colors = ['firebrick' if y == peak_year else 'steelblue' if y == trough_year 
             else 'darkgrey' for y in ebit_df['Year']]
    
    bars = ax1.bar(ebit_df['Year'], ebit_df['EBIT'], color=colors, alpha=0.8, 
                  edgecolor='black', linewidth=2)
    
    # Enhanced statistical overlays
    ax1.axhspan(avg_ebit - std_ebit, avg_ebit + std_ebit, alpha=0.2, color='green', 
               label=f'Normal Range (±1σ)')
    ax1.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=3,
               label=f'Normalized EBIT: ${avg_ebit:.1f}M')
    
    # Enhanced labels
    for bar, value in zip(bars, ebit_df['EBIT']):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3, 
                f'${value}M', ha='center', va='bottom', fontweight='bold', fontsize=11,
                bbox=dict(boxstyle="round,pad=0.3", facecolor='white', alpha=0.9))
    
    # Enhanced annotations
    for year, label in events.items():
        if year in ebit_df['Year'].values:
            ebit_val = ebit_df[ebit_df['Year'] == year]['EBIT'].iloc[0]
            ax1.annotate(label, xy=(year, ebit_val), xytext=(year, ebit_val + 25),
                       arrowprops=dict(arrowstyle='->', color='red', lw=2),
                       bbox=dict(boxstyle="round,pad=0.3", facecolor='lightyellow', 
                               edgecolor='orange', alpha=0.9),
                       fontsize=10, ha='center', fontweight='bold')
    
    ax1.set_title('Enhanced EBIT Normalization with Events', fontsize=14, fontweight='bold')
    ax1.set_xlabel('Fiscal Year', fontsize=12)
    ax1.set_ylabel('EBIT ($ Millions)', fontsize=12)
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Volatility analysis
    rolling_cv = pd.Series(ebit_df['EBIT']).rolling(3).std()
    ax2.plot(ebit_df['Year'][2:], rolling_cv[2:], 'o-', color='orange', 
            linewidth=3, markersize=8, label='3-Year Rolling Volatility')
    ax2.set_title('EBIT Volatility Analysis', fontsize=14, fontweight='bold')
    ax2.set_ylabel('Standard Deviation', fontsize=12)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # Trend analysis
    years_numeric = range(len(ebit_df))
    z = np.polyfit(years_numeric, ebit_df['EBIT'], 1)
    p = np.poly1d(z)
    
    ax3.scatter(ebit_df['Year'], ebit_df['EBIT'], s=100, alpha=0.7, c='purple')
    ax3.plot(ebit_df['Year'], p(years_numeric), "r--", alpha=0.8, linewidth=3, label='Trend Line')
    ax3.set_title('EBIT Trend Analysis', fontsize=14, fontweight='bold')
    ax3.set_ylabel('EBIT ($ Millions)', fontsize=12)
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Summary statistics
    cv = (std_ebit / avg_ebit) * 100
    quality_score = 100 - min(cv, 50)  # Quality score out of 100
    
    stats_text = f"""
    EBIT QUALITY ANALYSIS
    
    • Mean EBIT: ${avg_ebit:.1f}M
    • Standard Deviation: ${std_ebit:.1f}M
    • Coefficient of Variation: {cv:.1f}%
    • Quality Score: {quality_score:.0f}/100
    
    CYCLE ANALYSIS:
    • Peak: {peak_year} (${ebit_df.loc[ebit_df['Year']==peak_year, 'EBIT'].iloc[0]}M)
    • Trough: {trough_year} (${ebit_df.loc[ebit_df['Year']==trough_year, 'EBIT'].iloc[0]}M)
    • Trend: {'+' if z[0] > 0 else ''}${z[0]:.1f}M/year
    
    EPV RECOMMENDATION:
    Use ${avg_ebit:.1f}M as normalized EBIT
    Quality: {"HIGH" if cv < 15 else "MEDIUM" if cv < 25 else "LOW"}
    """
    
    ax4.text(0.05, 0.95, stats_text, transform=ax4.transAxes, fontsize=11,
            bbox=dict(boxstyle="round,pad=0.5", facecolor='lightblue', alpha=0.9),
            verticalalignment='top', fontfamily='monospace')
    ax4.set_title('Statistical Summary', fontsize=14, fontweight='bold')
    ax4.axis('off')
    
    plt.tight_layout()
    plt.show()

def plot_2_enhanced_capex():
    """2. MASSIVELY Enhanced Capex Analysis"""
    print("\n🎯 ENHANCED CAPEX BREAKDOWN ANALYSIS...")
    
    _, capex_data, _, _, _ = create_enhanced_data()
    capex_df = pd.DataFrame(capex_data)
    capex_df['Growth Capex'] = capex_df['Total Capex'] - capex_df['Maintenance Capex']
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 14))
    fig.suptitle('ENHANCED CAPEX ANALYSIS SUITE', fontsize=18, fontweight='bold')
    
    # Enhanced stacked chart
    avg_maint = capex_df['Maintenance Capex'].mean()
    
    p1 = ax1.bar(capex_df['Year'], capex_df['Maintenance Capex'], 
                label='Maintenance Capex', color='darkcyan', alpha=0.8, edgecolor='black')
    p2 = ax1.bar(capex_df['Year'], capex_df['Growth Capex'], 
                bottom=capex_df['Maintenance Capex'],
                label='Growth Capex', color='lightcoral', alpha=0.8, edgecolor='black')
    
    ax1.axhline(avg_maint, color='darkblue', linestyle='--', linewidth=3,
               label=f'Avg Maintenance: ${avg_maint:.1f}M')
    
    # Enhanced data labels
    for i, row in capex_df.iterrows():
        # Maintenance label
        ax1.text(row['Year'], row['Maintenance Capex']/2, 
                f"${row['Maintenance Capex']}M", ha='center', va='center', 
                fontweight='bold', color='white', fontsize=10)
        # Growth label
        ax1.text(row['Year'], row['Maintenance Capex'] + row['Growth Capex']/2, 
                f"${row['Growth Capex']}M", ha='center', va='center', 
                fontweight='bold', color='white', fontsize=10)
        # Total with percentage
        maint_pct = (row['Maintenance Capex'] / row['Total Capex']) * 100
        ax1.text(row['Year'], row['Total Capex'] + 3, 
                f"Total: ${row['Total Capex']}M\n({maint_pct:.0f}% Maint)", 
                ha='center', va='bottom', fontweight='bold', fontsize=10,
                bbox=dict(boxstyle="round,pad=0.3", facecolor='yellow', alpha=0.8))
    
    ax1.set_title('Enhanced Capex Breakdown with Ratios', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Capital Expenditure ($ Millions)', fontsize=12)
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Maintenance ratio trends
    maint_ratio = (capex_df['Maintenance Capex'] / capex_df['Total Capex']) * 100
    ax2.plot(capex_df['Year'], maint_ratio, 'o-', linewidth=3, markersize=10, 
            color='purple', label='Maintenance Ratio')
    ax2.axhline(maint_ratio.mean(), color='red', linestyle='--', alpha=0.7,
               label=f'Average: {maint_ratio.mean():.1f}%')
    ax2.fill_between(capex_df['Year'], maint_ratio, alpha=0.3, color='purple')
    ax2.set_title('Maintenance Capex Ratio Trends', fontsize=14, fontweight='bold')
    ax2.set_ylabel('Maintenance Ratio (%)', fontsize=12)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # Growth investment pattern
    growth_3y = capex_df['Growth Capex'].rolling(3).sum()
    ax3.bar(capex_df['Year'], capex_df['Growth Capex'], alpha=0.6, color='green', 
           label='Annual Growth Capex')
    ax3.plot(capex_df['Year'], growth_3y, 'ro-', linewidth=3, markersize=8, 
            label='3-Year Rolling Sum')
    
    # Add efficiency annotations
    for i, (annual, rolling) in enumerate(zip(capex_df['Growth Capex'], growth_3y)):
        if not pd.isna(rolling):
            efficiency = rolling / 3  # Average efficiency
            ax3.text(capex_df['Year'].iloc[i], annual + 2,
                    f'${annual}M\n(3Y Avg: ${efficiency:.0f}M)',
                    ha='center', va='bottom', fontsize=9, fontweight='bold')
    
    ax3.set_title('Growth Investment Pattern & Efficiency', fontsize=14, fontweight='bold')
    ax3.set_ylabel('Growth Capex ($ Millions)', fontsize=12)
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Comprehensive summary
    total_capex = capex_df['Total Capex'].sum()
    total_maint = capex_df['Maintenance Capex'].sum()
    total_growth = capex_df['Growth Capex'].sum()
    consistency_score = 100 - ((capex_df['Maintenance Capex'].std() / avg_maint) * 100)
    
    summary_text = f"""
    CAPEX ANALYSIS SUMMARY
    
    5-YEAR TOTALS:
    • Total Capex: ${total_capex}M
    • Maintenance: ${total_maint}M ({total_maint/total_capex*100:.1f}%)
    • Growth: ${total_growth}M ({total_growth/total_capex*100:.1f}%)
    
    KEY METRICS:
    • Avg Annual Maintenance: ${avg_maint:.1f}M
    • Maintenance Consistency: {consistency_score:.0f}/100
    • Growth Volatility: {capex_df['Growth Capex'].std():.1f}M
    
    EPV IMPLICATIONS:
    • Use ${avg_maint:.1f}M for maintenance capex
    • Quality: {"HIGH" if consistency_score > 80 else "MEDIUM" if consistency_score > 60 else "LOW"}
    • Growth discipline: {"GOOD" if capex_df['Growth Capex'].std() < 15 else "NEEDS IMPROVEMENT"}
    """
    
    ax4.text(0.05, 0.95, summary_text, transform=ax4.transAxes, fontsize=11,
            bbox=dict(boxstyle="round,pad=0.5", facecolor='lightgreen', alpha=0.9),
            verticalalignment='top', fontfamily='monospace')
    ax4.set_title('Capex Investment Summary', fontsize=14, fontweight='bold')
    ax4.axis('off')
    
    plt.tight_layout()
    plt.show()

def plot_3_enhanced_epv_dcf():
    """3. MASSIVELY Enhanced EPV vs DCF Interactive"""
    print("\n🎯 ENHANCED EPV vs DCF INTERACTIVE ANALYSIS...")
    
    _, _, dcf_data, epv_scenarios, _ = create_enhanced_data()
    dcf_df = pd.DataFrame(dcf_data)
    
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('EPV Stability vs DCF Growth Sensitivity', 
                      'Growth Assumption Risk Profile', 
                      'Sensitivity Waterfall Analysis', 
                      'Investment Decision Matrix'),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )
    
    # Enhanced main comparison
    colors = ['#1f77b4', '#ff7f0e', '#d62728', '#9467bd']
    fig.add_trace(
        go.Bar(x=dcf_df['Growth Rate'], y=dcf_df['DCF Value'],
              name='DCF Valuation', marker_color=colors, opacity=0.8,
              text=[f'${val:.0f}' for val in dcf_df['DCF Value']], 
              textposition='outside',
              hovertemplate='<b>DCF Analysis</b><br>Growth: %{x}<br>Value: $%{y:.0f}<br>Risk: High<extra></extra>'),
        row=1, col=1
    )
    
    # EPV scenarios with confidence bands
    epv_colors = ['darkgreen', 'green', 'lightgreen']
    for i, (name, value) in enumerate(epv_scenarios.items()):
        fig.add_hline(y=value, line_dash="dash", line_color=epv_colors[i], 
                     line_width=4, opacity=0.9,
                     annotation_text=f"EPV {name}: ${value:.0f} (Low Risk)",
                     annotation_position="right", row=1, col=1)
    
    # Risk-return analysis
    growth_rates = [0, 2, 4, 6]
    risk_levels = [15, 35, 60, 90]  # Increasing risk with growth
    
    fig.add_trace(
        go.Scatter(x=risk_levels, y=dcf_df['DCF Value'],
                  mode='markers+text+lines', name='DCF Risk Profile',
                  marker=dict(size=15, color=colors, opacity=0.8),
                  text=[f"{g}%" for g in growth_rates],
                  textposition="top center", line=dict(width=3, dash='dot'),
                  hovertemplate='<b>DCF Risk Analysis</b><br>Growth: %{text}<br>Risk Score: %{x}<br>Value: $%{y:.0f}<extra></extra>'),
        row=1, col=2
    )
    
    # Add EPV as low-risk benchmark
    fig.add_trace(
        go.Scatter(x=[5], y=[125], mode='markers+text',
                  marker=dict(size=25, color='green', symbol='star'),
                  text=['EPV<br>Base'], textposition="top center",
                  name='EPV (Low Risk)', showlegend=False,
                  hovertemplate='<b>EPV Base Case</b><br>Risk Score: 5<br>Value: $125<br>Method: Conservative<extra></extra>'),
        row=1, col=2
    )
    
    # Sensitivity waterfall
    base_dcf = dcf_df['DCF Value'].iloc[0]
    sensitivity_impact = [val - base_dcf for val in dcf_df['DCF Value']]
    
    fig.add_trace(
        go.Waterfall(x=dcf_df['Growth Rate'], y=sensitivity_impact,
                    name="Growth Impact on Valuation",
                    connector={"line": {"color": "rgb(63, 63, 63)"}},
                    increasing={"marker": {"color": "green"}},
                    decreasing={"marker": {"color": "red"}},
                    textposition="outside",
                    texttemplate='%{y:+.0f}'),
        row=2, col=1
    )
    
    # Investment decision matrix
    methods = ['EPV Conservative', 'EPV Base', 'DCF 0%', 'DCF 4%', 'DCF 6%']
    values = [115, 125, 95, 165, 240]
    risk_scores = [5, 5, 15, 60, 90]
    
    # Color code by investment recommendation
    decision_colors = []
    for val, risk in zip(values, risk_scores):
        if val > 130 and risk < 20:
            decision_colors.append('green')  # Strong Buy
        elif val > 110 and risk < 40:
            decision_colors.append('lightgreen')  # Buy
        elif val > 100:
            decision_colors.append('yellow')  # Hold
        else:
            decision_colors.append('red')  # Sell
    
    fig.add_trace(
        go.Scatter(x=risk_scores, y=values,
                  mode='markers+text', name='Investment Decision Matrix',
                  marker=dict(size=20, color=decision_colors, 
                             line=dict(width=2, color='black')),
                  text=methods, textposition="top center",
                  hovertemplate='<b>%{text}</b><br>Risk Score: %{x}<br>Value: $%{y:.0f}<br>Recommendation: Based on color<extra></extra>'),
        row=2, col=2
    )
    
    fig.update_layout(
        title_text="ENHANCED EPV vs DCF COMPREHENSIVE ANALYSIS DASHBOARD",
        showlegend=True,
        height=900,
        template='plotly_white'
    )
    
    fig.show()

def run_enhanced_suite():
    """Execute the enhanced EPV suite"""
    print("🚀 ENHANCED EPV VISUALIZATION SUITE")
    print("📈 Massively Improved Implementation of prompts_2.md")
    print("🔬 Professional Analytics • Advanced Insights • Investment-Grade Quality")
    print("=" * 80)
    
    plot_1_enhanced_ebit()
    plot_2_enhanced_capex() 
    plot_3_enhanced_epv_dcf()
    
    print("\n✅ ENHANCED EPV SUITE COMPLETE!")
    print("📊 All Visualizations Enhanced with Professional Features")
    print("💼 Ready for Investment Analysis and Decision Making")
    print("=" * 80)

if __name__ == "__main__":
    run_enhanced_suite() 