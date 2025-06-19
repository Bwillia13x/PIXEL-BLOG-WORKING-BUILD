#!/usr/bin/env python3
"""
ULTIMATE Enhanced EPV Analysis - Professional Implementation
Massively improved version of prompts_2.md with advanced analytics
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

def enhanced_ebit_analysis():
    """Enhanced EBIT Normalization with Professional Analytics"""
    print("\n🎯 ENHANCED EBIT NORMALIZATION ANALYSIS")
    
    # Data
    ebit_data = {
        'Year': range(2014, 2024),
        'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115]
    }
    events = {2016: "Major Acquisition", 2018: "Market Downturn", 2021: "Recovery"}
    
    ebit_df = pd.DataFrame(ebit_data)
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(18, 12))
    fig.suptitle('ENHANCED EBIT NORMALIZATION ANALYSIS', fontsize=16, fontweight='bold')
    
    # Main chart
    avg_ebit = ebit_df['EBIT'].mean()
    std_ebit = ebit_df['EBIT'].std()
    peak_year = ebit_df.loc[ebit_df['EBIT'].idxmax(), 'Year']
    trough_year = ebit_df.loc[ebit_df['EBIT'].idxmin(), 'Year']
    
    colors = ['firebrick' if y == peak_year else 'steelblue' if y == trough_year 
             else 'darkgrey' for y in ebit_df['Year']]
    
    bars = ax1.bar(ebit_df['Year'], ebit_df['EBIT'], color=colors, alpha=0.8, edgecolor='black')
    ax1.axhspan(avg_ebit - std_ebit, avg_ebit + std_ebit, alpha=0.2, color='green')
    ax1.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=3,
               label=f'Normalized EBIT: ${avg_ebit:.1f}M')
    
    # Enhanced labels
    for bar, value in zip(bars, ebit_df['EBIT']):
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, 
                f'${value}M', ha='center', va='bottom', fontweight='bold')
    
    # Events
    for year, label in events.items():
        if year in ebit_df['Year'].values:
            ebit_val = ebit_df[ebit_df['Year'] == year]['EBIT'].iloc[0]
            ax1.annotate(label, xy=(year, ebit_val), xytext=(year, ebit_val + 20),
                       arrowprops=dict(arrowstyle='->', color='red'),
                       bbox=dict(boxstyle="round", facecolor='yellow', alpha=0.8))
    
    ax1.set_title('Enhanced EBIT Normalization', fontsize=14, fontweight='bold')
    ax1.set_ylabel('EBIT ($ Millions)')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Volatility
    rolling_std = pd.Series(ebit_df['EBIT']).rolling(3).std()
    ax2.plot(ebit_df['Year'][2:], rolling_std[2:], 'o-', color='orange', linewidth=2)
    ax2.set_title('EBIT Volatility (3-Year Rolling)')
    ax2.set_ylabel('Standard Deviation')
    ax2.grid(True, alpha=0.3)
    
    # Trend
    years_numeric = range(len(ebit_df))
    z = np.polyfit(years_numeric, ebit_df['EBIT'], 1)
    p = np.poly1d(z)
    ax3.scatter(ebit_df['Year'], ebit_df['EBIT'], s=100, alpha=0.7)
    ax3.plot(ebit_df['Year'], p(years_numeric), "r--", linewidth=2, label='Trend')
    ax3.set_title('EBIT Trend Analysis')
    ax3.set_ylabel('EBIT ($ Millions)')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Summary
    cv = (std_ebit / avg_ebit) * 100
    quality = "HIGH" if cv < 15 else "MEDIUM" if cv < 25 else "LOW"
    
    summary = f"""EBIT ANALYSIS SUMMARY
    
Mean EBIT: ${avg_ebit:.1f}M
Std Deviation: ${std_ebit:.1f}M
Coefficient of Variation: {cv:.1f}%
Quality Rating: {quality}

Peak: {peak_year} (${ebit_df.loc[ebit_df['Year']==peak_year, 'EBIT'].iloc[0]}M)
Trough: {trough_year} (${ebit_df.loc[ebit_df['Year']==trough_year, 'EBIT'].iloc[0]}M)

EPV Recommendation:
Use ${avg_ebit:.1f}M as normalized EBIT"""
    
    ax4.text(0.05, 0.95, summary, transform=ax4.transAxes, fontsize=10,
            bbox=dict(boxstyle="round", facecolor='lightblue'),
            verticalalignment='top', fontfamily='monospace')
    ax4.set_title('Statistical Summary')
    ax4.axis('off')
    
    plt.tight_layout()
    plt.show()

def enhanced_capex_analysis():
    """Enhanced Capex Breakdown Analysis"""
    print("\n🎯 ENHANCED CAPEX BREAKDOWN ANALYSIS")
    
    # Data
    capex_data = {
        'Year': range(2019, 2024),
        'Total Capex': [80, 95, 75, 110, 85],
        'Maintenance Capex': [50, 55, 52, 60, 58]
    }
    
    capex_df = pd.DataFrame(capex_data)
    capex_df['Growth Capex'] = capex_df['Total Capex'] - capex_df['Maintenance Capex']
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(18, 12))
    fig.suptitle('ENHANCED CAPEX ANALYSIS', fontsize=16, fontweight='bold')
    
    # Main stacked chart
    avg_maint = capex_df['Maintenance Capex'].mean()
    
    p1 = ax1.bar(capex_df['Year'], capex_df['Maintenance Capex'], 
                label='Maintenance Capex', color='darkcyan', alpha=0.8)
    p2 = ax1.bar(capex_df['Year'], capex_df['Growth Capex'], 
                bottom=capex_df['Maintenance Capex'],
                label='Growth Capex', color='lightcoral', alpha=0.8)
    
    ax1.axhline(avg_maint, color='darkblue', linestyle='--', linewidth=2,
               label=f'Avg Maintenance: ${avg_maint:.1f}M')
    
    # Enhanced labels
    for i, row in capex_df.iterrows():
        ax1.text(row['Year'], row['Maintenance Capex']/2, 
                f"${row['Maintenance Capex']}M", ha='center', va='center', 
                fontweight='bold', color='white')
        ax1.text(row['Year'], row['Maintenance Capex'] + row['Growth Capex']/2, 
                f"${row['Growth Capex']}M", ha='center', va='center', 
                fontweight='bold', color='white')
        ax1.text(row['Year'], row['Total Capex'] + 2, 
                f"Total: ${row['Total Capex']}M", ha='center', va='bottom', 
                fontweight='bold')
    
    ax1.set_title('Enhanced Capex Breakdown')
    ax1.set_ylabel('Capital Expenditure ($ Millions)')
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # Ratios
    maint_ratio = (capex_df['Maintenance Capex'] / capex_df['Total Capex']) * 100
    ax2.plot(capex_df['Year'], maint_ratio, 'o-', linewidth=3, markersize=8, color='purple')
    ax2.axhline(maint_ratio.mean(), color='red', linestyle='--', alpha=0.7)
    ax2.set_title('Maintenance Capex Ratio')
    ax2.set_ylabel('Maintenance Ratio (%)')
    ax2.grid(True, alpha=0.3)
    
    # Growth pattern
    growth_3y = capex_df['Growth Capex'].rolling(3).sum()
    ax3.bar(capex_df['Year'], capex_df['Growth Capex'], alpha=0.6, color='green')
    ax3.plot(capex_df['Year'], growth_3y, 'ro-', linewidth=2, markersize=6)
    ax3.set_title('Growth Investment Pattern')
    ax3.set_ylabel('Growth Capex ($ Millions)')
    ax3.grid(True, alpha=0.3)
    
    # Summary
    total_capex = capex_df['Total Capex'].sum()
    total_maint = capex_df['Maintenance Capex'].sum()
    total_growth = capex_df['Growth Capex'].sum()
    
    summary = f"""CAPEX ANALYSIS SUMMARY

5-Year Totals:
• Total Capex: ${total_capex}M
• Maintenance: ${total_maint}M ({total_maint/total_capex*100:.1f}%)
• Growth: ${total_growth}M ({total_growth/total_capex*100:.1f}%)

Key Metrics:
• Avg Maintenance: ${avg_maint:.1f}M
• Consistency Score: {100-((capex_df['Maintenance Capex'].std()/avg_maint)*100):.0f}/100

EPV Recommendation:
Use ${avg_maint:.1f}M for maintenance capex"""
    
    ax4.text(0.05, 0.95, summary, transform=ax4.transAxes, fontsize=10,
            bbox=dict(boxstyle="round", facecolor='lightgreen'),
            verticalalignment='top', fontfamily='monospace')
    ax4.set_title('Capex Summary')
    ax4.axis('off')
    
    plt.tight_layout()
    plt.show()

def enhanced_epv_dcf_comparison():
    """Enhanced EPV vs DCF Interactive Analysis"""
    print("\n🎯 ENHANCED EPV vs DCF ANALYSIS")
    
    # Data
    dcf_data = {
        'Growth Rate': ['0%', '2%', '4%', '6%'],
        'DCF Value': [95.00, 120.00, 165.00, 240.00]
    }
    epv_scenarios = {"Conservative": 115.00, "Base Case": 125.00, "Optimistic": 135.00}
    
    dcf_df = pd.DataFrame(dcf_data)
    
    fig = make_subplots(
        rows=2, cols=2,
        subplot_titles=('EPV vs DCF Comparison', 'Risk-Return Profile', 
                      'Sensitivity Analysis', 'Investment Decision'),
        specs=[[{"secondary_y": False}, {"secondary_y": False}],
               [{"secondary_y": False}, {"secondary_y": False}]]
    )
    
    # Main comparison
    colors = ['#1f77b4', '#ff7f0e', '#d62728', '#9467bd']
    fig.add_trace(
        go.Bar(x=dcf_df['Growth Rate'], y=dcf_df['DCF Value'],
              name='DCF Valuation', marker_color=colors, opacity=0.8,
              text=[f'${val:.0f}' for val in dcf_df['DCF Value']], 
              textposition='outside'),
        row=1, col=1
    )
    
    # EPV lines
    epv_colors = ['darkgreen', 'green', 'lightgreen']
    for i, (name, value) in enumerate(epv_scenarios.items()):
        fig.add_hline(y=value, line_dash="dash", line_color=epv_colors[i], 
                     line_width=3, opacity=0.8,
                     annotation_text=f"EPV {name}: ${value:.0f}",
                     annotation_position="right", row=1, col=1)
    
    # Risk analysis
    growth_rates = [0, 2, 4, 6]
    risk_levels = [10, 30, 50, 80]
    
    fig.add_trace(
        go.Scatter(x=risk_levels, y=dcf_df['DCF Value'],
                  mode='markers+text+lines', name='Risk Profile',
                  marker=dict(size=15, color=colors),
                  text=[f"{g}%" for g in growth_rates],
                  textposition="top center"),
        row=1, col=2
    )
    
    fig.add_trace(
        go.Scatter(x=[5], y=[125], mode='markers+text',
                  marker=dict(size=20, color='green', symbol='star'),
                  text=['EPV'], textposition="top center",
                  name='EPV (Low Risk)'),
        row=1, col=2
    )
    
    # Sensitivity waterfall
    base_dcf = dcf_df['DCF Value'].iloc[0]
    sensitivity = [val - base_dcf for val in dcf_df['DCF Value']]
    
    fig.add_trace(
        go.Waterfall(x=dcf_df['Growth Rate'], y=sensitivity,
                    name="Growth Impact", 
                    increasing={"marker": {"color": "green"}},
                    decreasing={"marker": {"color": "red"}}),
        row=2, col=1
    )
    
    # Decision matrix
    methods = ['EPV Cons', 'EPV Base', 'DCF 0%', 'DCF 4%', 'DCF 6%']
    values = [115, 125, 95, 165, 240]
    risks = [5, 5, 10, 50, 80]
    
    fig.add_trace(
        go.Scatter(x=risks, y=values,
                  mode='markers+text', name='Decision Matrix',
                  marker=dict(size=15, color='blue'),
                  text=methods, textposition="top center"),
        row=2, col=2
    )
    
    fig.update_layout(
        title_text="ENHANCED EPV vs DCF ANALYSIS DASHBOARD",
        height=800,
        template='plotly_white'
    )
    
    fig.show()

def run_ultimate_epv_suite():
    """Run the ultimate enhanced EPV suite"""
    print("🚀 ULTIMATE ENHANCED EPV VISUALIZATION SUITE")
    print("📈 Professional Implementation with Advanced Analytics")
    print("=" * 60)
    
    enhanced_ebit_analysis()
    enhanced_capex_analysis()
    enhanced_epv_dcf_comparison()
    
    print("\n✅ ULTIMATE EPV SUITE COMPLETE!")
    print("📊 All Visualizations Enhanced and Rendered Successfully")
    print("=" * 60)

if __name__ == "__main__":
    run_ultimate_epv_suite() 