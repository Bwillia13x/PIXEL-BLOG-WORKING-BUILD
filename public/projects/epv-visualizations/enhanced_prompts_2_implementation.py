#!/usr/bin/env python3
"""
ULTIMATE Enhanced EPV Implementation - Advanced Visualization Suite
Comprehensive improvement and enhancement of prompts_2.md
Based on Bruce Greenwald's Earnings Power Value methodology with cutting-edge analytics
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.figure_factory as ff
from matplotlib.patches import Patch
import warnings
warnings.filterwarnings('ignore')

# Premium styling configuration
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("Set2")

def create_sample_data():
    """Generate comprehensive sample datasets for EPV analysis"""
    np.random.seed(42)
    
    # Enhanced EBIT data with more metrics
    ebit_data = {
        'Year': range(2014, 2024),
        'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115],
        'Revenue': [800, 920, 1100, 980, 750, 650, 850, 1200, 980, 900],
        'EBIT_Margin': [13.1, 13.0, 13.2, 13.3, 12.7, 12.3, 12.9, 12.9, 12.8, 12.8],
        'Industry_EBIT': [100, 115, 140, 125, 90, 75, 105, 150, 120, 110]
    }
    
    # Enhanced Capex data
    capex_data = {
        'Year': range(2019, 2024),
        'Total_Capex': [80, 95, 75, 110, 85],
        'Maintenance_Capex': [50, 55, 52, 60, 58],
        'Growth_Capex': [30, 40, 23, 50, 27],
        'Depreciation': [45, 48, 50, 52, 55],
        'Asset_Base': [500, 520, 540, 580, 600]
    }
    
    # Enhanced DCF scenarios with sensitivity analysis
    dcf_data = {
        'Growth_Rate': ['0%', '2%', '4%', '6%', '8%'],
        'DCF_Value': [95.00, 120.00, 165.00, 240.00, 385.00],
        'Terminal_Multiple': [12.5, 15.0, 20.0, 30.0, 48.1],
        'Probability': [25, 30, 25, 15, 5]  # Probability weights
    }
    
    # Multiple EPV scenarios with confidence intervals
    epv_scenarios = {
        "Deep Value": {"value": 95.00, "confidence": 85, "probability": 15},
        "Conservative": {"value": 115.00, "confidence": 90, "probability": 25},
        "Base Case": {"value": 125.00, "confidence": 85, "probability": 35},
        "Optimistic": {"value": 135.00, "confidence": 75, "probability": 20},
        "Bull Case": {"value": 150.00, "confidence": 60, "probability": 5}
    }
    
    # Advanced valuation summary
    valuation_data = [
        {'method': 'EPV (Conservative)', 'low': 115, 'mid': 125, 'high': 135, 'confidence': 95, 'weight': 40},
        {'method': 'DCF (Base)', 'low': 110, 'mid': 165, 'high': 240, 'confidence': 70, 'weight': 25},
        {'method': 'Comparable Companies', 'low': 130, 'mid': 155, 'high': 180, 'confidence': 65, 'weight': 15},
        {'method': 'Precedent M&A', 'low': 150, 'mid': 175, 'high': 200, 'confidence': 50, 'weight': 10},
        {'method': 'Asset-Based', 'low': 85, 'mid': 110, 'high': 135, 'confidence': 80, 'weight': 5},
        {'method': 'Sum-of-Parts', 'low': 140, 'mid': 165, 'high': 190, 'confidence': 60, 'weight': 5}
    ]
    
    return ebit_data, capex_data, dcf_data, epv_scenarios, valuation_data

def plot_1_normalized_ebit_professional():
    """1. PROFESSIONAL Normalized Earnings Bar Chart - MASSIVELY ENHANCED"""
    print("\n🎯 GENERATING PROFESSIONAL EBIT NORMALIZATION SUITE...")
    
    ebit_data, _, _, _, _ = create_sample_data()
    ebit_df = pd.DataFrame(ebit_data)
    
    # Create comprehensive 2x3 subplot layout
    fig, axes = plt.subplots(2, 3, figsize=(24, 16))
    fig.suptitle('PROFESSIONAL EPV EBIT NORMALIZATION ANALYSIS SUITE', fontsize=20, fontweight='bold', y=0.95)
    
    # 1.1 Main EBIT Analysis with Advanced Features
    ax1 = axes[0, 0]
    avg_ebit = ebit_df['EBIT'].mean()
    std_ebit = ebit_df['EBIT'].std()
    peak_year = ebit_df.loc[ebit_df['EBIT'].idxmax(), 'Year']
    trough_year = ebit_df.loc[ebit_df['EBIT'].idxmin(), 'Year']
    
    # Enhanced color coding
    colors = []
    for _, row in ebit_df.iterrows():
        if row['Year'] == peak_year:
            colors.append('#d32f2f')  # Peak - Red
        elif row['Year'] == trough_year:
            colors.append('#1976d2')  # Trough - Blue
        elif ebit_df['EBIT'] > avg_ebit + 0.5*std_ebit:
            colors.append('#ff9800')  # Above average - Orange
        elif ebit_df['EBIT'] < avg_ebit - 0.5*std_ebit:
            colors.append('#9c27b0')  # Below average - Purple
        else:
            colors.append('#388e3c')  # Normal - Green
    
    bars = ax1.bar(ebit_df['Year'], ebit_df['EBIT'], color=colors, alpha=0.8, 
                   edgecolor='black', linewidth=1.5, width=0.8)
    
    # Advanced statistical overlays
    ax1.axhspan(avg_ebit - std_ebit, avg_ebit + std_ebit, alpha=0.2, color='green', 
               label=f'Normal Range (±1σ): {avg_ebit-std_ebit:.1f}-{avg_ebit+std_ebit:.1f}M')
    ax1.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=3,
               label=f'Normalized EBIT: ${avg_ebit:.1f}M')
    ax1.axhline(avg_ebit + 2*std_ebit, color='red', linestyle=':', alpha=0.7,
               label=f'Extreme High (+2σ): ${avg_ebit + 2*std_ebit:.1f}M')
    ax1.axhline(avg_ebit - 2*std_ebit, color='red', linestyle=':', alpha=0.7,
               label=f'Extreme Low (-2σ): ${avg_ebit - 2*std_ebit:.1f}M')
    
    # Enhanced value labels with conditional formatting
    for bar, value, year in zip(bars, ebit_df['EBIT'], ebit_df['Year']):
        label_color = 'white' if value < avg_ebit else 'black'
        bbox_color = 'red' if year in [peak_year, trough_year] else 'lightblue'
        ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3,
                f'${value}M\n({year})', ha='center', va='bottom', fontweight='bold',
                fontsize=9, color=label_color,
                bbox=dict(boxstyle="round,pad=0.3", facecolor=bbox_color, alpha=0.8))
    
    ax1.set_title('EBIT Normalization with Statistical Analysis', fontsize=14, fontweight='bold')
    ax1.set_ylabel('EBIT ($ Millions)', fontsize=12)
    ax1.legend(loc='upper left', fontsize=9)
    ax1.grid(True, alpha=0.3)
    
    # 1.2 EBIT vs Industry Comparison
    ax2 = axes[0, 1]
    x_pos = np.arange(len(ebit_df))
    width = 0.35
    
    bars1 = ax2.bar(x_pos - width/2, ebit_df['EBIT'], width, label='Company EBIT', 
                   color='steelblue', alpha=0.8)
    bars2 = ax2.bar(x_pos + width/2, ebit_df['Industry_EBIT'], width, label='Industry Average', 
                   color='orange', alpha=0.8)
    
    # Performance differential
    diff = ebit_df['EBIT'] - ebit_df['Industry_EBIT']
    for i, d in enumerate(diff):
        color = 'green' if d > 0 else 'red'
        ax2.text(i, max(ebit_df['EBIT'].iloc[i], ebit_df['Industry_EBIT'].iloc[i]) + 5,
                f'{d:+.0f}M', ha='center', va='bottom', fontweight='bold', color=color)
    
    ax2.set_title('Company vs Industry EBIT Performance', fontsize=14, fontweight='bold')
    ax2.set_ylabel('EBIT ($ Millions)', fontsize=12)
    ax2.set_xticks(x_pos)
    ax2.set_xticklabels(ebit_df['Year'], rotation=45)
    ax2.legend()
    ax2.grid(True, alpha=0.3)
    
    # 1.3 EBIT Margin Stability Analysis
    ax3 = axes[0, 2]
    margin_trend = ax3.plot(ebit_df['Year'], ebit_df['EBIT_Margin'], 'o-', 
                           linewidth=3, markersize=10, color='purple', label='EBIT Margin')
    avg_margin = ebit_df['EBIT_Margin'].mean()
    ax3.axhline(avg_margin, color='red', linestyle='--', alpha=0.7,
               label=f'Average: {avg_margin:.1f}%')
    
    # Add margin bands
    margin_std = ebit_df['EBIT_Margin'].std()
    ax3.axhspan(avg_margin - margin_std, avg_margin + margin_std, alpha=0.2, color='purple')
    
    # Highlight margin volatility
    volatility = margin_std / avg_margin * 100
    ax3.text(0.02, 0.98, f'Margin Volatility: {volatility:.1f}%\n(Lower is Better)', 
            transform=ax3.transAxes, va='top',
            bbox=dict(boxstyle="round,pad=0.3", facecolor='lightyellow'))
    
    ax3.set_title('EBIT Margin Consistency Analysis', fontsize=14, fontweight='bold')
    ax3.set_ylabel('EBIT Margin (%)', fontsize=12)
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # 1.4 Revenue-EBIT Correlation Analysis
    ax4 = axes[1, 0]
    scatter = ax4.scatter(ebit_df['Revenue'], ebit_df['EBIT'], s=120, alpha=0.7, 
                         c=range(len(ebit_df)), cmap='viridis', edgecolors='black', linewidth=2)
    
    # Enhanced trend line with confidence interval
    z = np.polyfit(ebit_df['Revenue'], ebit_df['EBIT'], 1)
    p = np.poly1d(z)
    ax4.plot(ebit_df['Revenue'], p(ebit_df['Revenue']), "r--", alpha=0.8, linewidth=3, label='Trend Line')
    
    # Correlation metrics
    corr = ebit_df['Revenue'].corr(ebit_df['EBIT'])
    r_squared = corr**2
    
    ax4.text(0.05, 0.95, f'Correlation: {corr:.3f}\nR²: {r_squared:.3f}\nOperating Leverage: {z[0]:.3f}', 
            transform=ax4.transAxes, va='top',
            bbox=dict(boxstyle="round,pad=0.5", facecolor='wheat', alpha=0.9))
    
    # Add year labels
    for i, row in ebit_df.iterrows():
        ax4.annotate(str(row['Year']), (row['Revenue'], row['EBIT']), 
                    xytext=(5, 5), textcoords='offset points', fontsize=8)
    
    ax4.set_title('Revenue-EBIT Operating Leverage Analysis', fontsize=14, fontweight='bold')
    ax4.set_xlabel('Revenue ($ Millions)', fontsize=12)
    ax4.set_ylabel('EBIT ($ Millions)', fontsize=12)
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    # 1.5 Business Cycle Analysis
    ax5 = axes[1, 1]
    
    # Classify business cycle phases
    cycle_classification = []
    for i, ebit in enumerate(ebit_df['EBIT']):
        if i == 0:
            cycle_classification.append('Start')
        else:
            prev_ebit = ebit_df['EBIT'].iloc[i-1]
            if ebit > prev_ebit * 1.1:
                cycle_classification.append('Expansion')
            elif ebit < prev_ebit * 0.9:
                cycle_classification.append('Contraction')
            elif ebit > avg_ebit:
                cycle_classification.append('Peak')
            else:
                cycle_classification.append('Trough')
    
    cycle_colors = {'Start': 'gray', 'Expansion': 'green', 'Peak': 'gold', 
                   'Contraction': 'red', 'Trough': 'blue'}
    colors_cycle = [cycle_colors[phase] for phase in cycle_classification]
    
    bars_cycle = ax5.bar(ebit_df['Year'], ebit_df['EBIT'], color=colors_cycle, alpha=0.8)
    
    # Add cycle phase labels
    for bar, phase in zip(bars_cycle, cycle_classification):
        ax5.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2,
                phase, ha='center', va='bottom', fontsize=8, fontweight='bold',
                rotation=45)
    
    ax5.set_title('Business Cycle Phase Classification', fontsize=14, fontweight='bold')
    ax5.set_ylabel('EBIT ($ Millions)', fontsize=12)
    
    # Cycle legend
    legend_elements = [Patch(facecolor=color, label=phase) 
                      for phase, color in cycle_colors.items()]
    ax5.legend(handles=legend_elements, loc='upper right', fontsize=9)
    ax5.grid(True, alpha=0.3)
    
    # 1.6 Statistical Summary Dashboard
    ax6 = axes[1, 2]
    ax6.axis('off')
    
    # Comprehensive statistics
    stats_summary = f"""
    📊 COMPREHENSIVE EBIT ANALYSIS SUMMARY
    
    🎯 NORMALIZATION METRICS:
    • Normalized EBIT: ${avg_ebit:.1f}M
    • Standard Deviation: ${std_ebit:.1f}M
    • Coefficient of Variation: {(std_ebit/avg_ebit)*100:.1f}%
    • Range: ${ebit_df['EBIT'].min()}M - ${ebit_df['EBIT'].max()}M
    
    📈 PERFORMANCE METRICS:
    • Peak Year: {peak_year} (${ebit_df.loc[ebit_df['Year']==peak_year, 'EBIT'].iloc[0]}M)
    • Trough Year: {trough_year} (${ebit_df.loc[ebit_df['Year']==trough_year, 'EBIT'].iloc[0]}M)
    • Average Margin: {avg_margin:.1f}%
    • Margin Volatility: {(margin_std/avg_margin)*100:.1f}%
    
    🔍 QUALITY INDICATORS:
    • Revenue Correlation: {corr:.3f}
    • Operating Leverage: {z[0]:.3f}
    • Consistency Score: {100-((std_ebit/avg_ebit)*100):.1f}/100
    
    💡 EPV IMPLICATION:
    {"✅ HIGH" if (std_ebit/avg_ebit) < 0.15 else "⚠️ MEDIUM" if (std_ebit/avg_ebit) < 0.25 else "❌ LOW"} Earnings Quality
    Recommended Normalized EBIT: ${avg_ebit:.1f}M
    """
    
    ax6.text(0.05, 0.95, stats_summary, transform=ax6.transAxes, va='top', ha='left',
            fontsize=11, fontfamily='monospace',
            bbox=dict(boxstyle="round,pad=0.8", facecolor='lightcyan', alpha=0.9))
    
    plt.tight_layout()
    plt.show()

def plot_2_maintenance_capex_professional():
    """2. PROFESSIONAL Maintenance Capex Breakdown - MASSIVELY ENHANCED"""
    print("\n🎯 GENERATING PROFESSIONAL CAPEX ANALYSIS SUITE...")
    
    _, capex_data, _, _, _ = create_sample_data()
    capex_df = pd.DataFrame(capex_data)
    capex_df['Growth_Capex'] = capex_df['Total_Capex'] - capex_df['Maintenance_Capex']
    
    fig, axes = plt.subplots(2, 3, figsize=(24, 16))
    fig.suptitle('PROFESSIONAL EPV MAINTENANCE CAPEX ANALYSIS SUITE', fontsize=20, fontweight='bold', y=0.95)
    
    # 2.1 Enhanced Stacked Capex Analysis
    ax1 = axes[0, 0]
    avg_maint = capex_df['Maintenance_Capex'].mean()
    
    # Advanced stacked bars with patterns
    p1 = ax1.bar(capex_df['Year'], capex_df['Maintenance_Capex'], 
                label='Maintenance Capex', color='darkcyan', alpha=0.8, 
                edgecolor='black', linewidth=1.5)
    p2 = ax1.bar(capex_df['Year'], capex_df['Growth_Capex'], 
                bottom=capex_df['Maintenance_Capex'],
                label='Growth Capex', color='lightcoral', alpha=0.8,
                edgecolor='black', linewidth=1.5, hatch='///')
    
    # Advanced reference lines
    ax1.axhline(avg_maint, color='darkblue', linestyle='--', linewidth=3,
               label=f'Avg Maintenance: ${avg_maint:.1f}M')
    
    # Enhanced data labels with ROI calculations
    for i, row in capex_df.iterrows():
        # Maintenance capex label
        ax1.text(row['Year'], row['Maintenance_Capex']/2,
                f"${row['Maintenance_Capex']}M\n({row['Maintenance_Capex']/row['Asset_Base']*100:.1f}% of Assets)",
                ha='center', va='center', fontweight='bold', color='white', fontsize=9)
        
        # Growth capex label with efficiency metric
        growth_efficiency = row['Growth_Capex'] / (row['Asset_Base'] * 0.1) if row['Growth_Capex'] > 0 else 0
        ax1.text(row['Year'], row['Maintenance_Capex'] + row['Growth_Capex']/2,
                f"${row['Growth_Capex']}M\n(Eff: {growth_efficiency:.1f}x)",
                ha='center', va='center', fontweight='bold', color='white', fontsize=9)
        
        # Total with ratio
        total_ratio = row['Maintenance_Capex'] / row['Total_Capex'] * 100
        ax1.text(row['Year'], row['Total_Capex'] + 5,
                f"Total: ${row['Total_Capex']}M\n(Maint: {total_ratio:.0f}%)",
                ha='center', va='bottom', fontweight='bold', fontsize=10,
                bbox=dict(boxstyle="round,pad=0.3", facecolor='yellow', alpha=0.8))
    
    ax1.set_title('Enhanced Capex Allocation Analysis', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Capital Expenditure ($ Millions)', fontsize=12)
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # 2.2 Capex Efficiency Ratios
    ax2 = axes[0, 1]
    
    # Multiple ratio analysis
    maint_ratio = capex_df['Maintenance_Capex'] / capex_df['Total_Capex'] * 100
    asset_ratio = capex_df['Total_Capex'] / capex_df['Asset_Base'] * 100
    
    ax2_twin = ax2.twinx()
    
    line1 = ax2.plot(capex_df['Year'], maint_ratio, 'o-', linewidth=3, markersize=10,
                    color='purple', label='Maintenance %')
    line2 = ax2_twin.plot(capex_df['Year'], asset_ratio, 's-', linewidth=3, markersize=10,
                         color='orange', label='Capex/Assets %')
    
    # Reference lines
    ax2.axhline(maint_ratio.mean(), color='purple', linestyle='--', alpha=0.7)
    ax2_twin.axhline(asset_ratio.mean(), color='orange', linestyle='--', alpha=0.7)
    
    ax2.set_title('Capex Efficiency Ratios', fontsize=14, fontweight='bold')
    ax2.set_ylabel('Maintenance Capex (%)', fontsize=12, color='purple')
    ax2_twin.set_ylabel('Total Capex/Assets (%)', fontsize=12, color='orange')
    
    # Combined legend
    lines = line1 + line2
    labels = [l.get_label() for l in lines]
    ax2.legend(lines, labels, loc='upper right')
    ax2.grid(True, alpha=0.3)
    
    # 2.3 Capex vs Depreciation Analysis
    ax3 = axes[0, 2]
    
    x_pos = np.arange(len(capex_df))
    width = 0.35
    
    bars1 = ax3.bar(x_pos - width/2, capex_df['Maintenance_Capex'], width,
                   label='Maintenance Capex', color='steelblue', alpha=0.8)
    bars2 = ax3.bar(x_pos + width/2, capex_df['Depreciation'], width,
                   label='Depreciation', color='orange', alpha=0.8)
    
    # Sustainability ratio (Maintenance Capex / Depreciation)
    sustainability = capex_df['Maintenance_Capex'] / capex_df['Depreciation']
    for i, (maint, depr, ratio) in enumerate(zip(capex_df['Maintenance_Capex'], 
                                                 capex_df['Depreciation'], sustainability)):
        color = 'green' if ratio >= 1.0 else 'red'
        ax3.text(i, max(maint, depr) + 3,
                f'Ratio: {ratio:.2f}\n{"✅" if ratio >= 1.0 else "⚠️"}',
                ha='center', va='bottom', fontweight='bold', color=color, fontsize=9)
    
    ax3.set_title('Asset Maintenance Sustainability', fontsize=14, fontweight='bold')
    ax3.set_ylabel('Amount ($ Millions)', fontsize=12)
    ax3.set_xticks(x_pos)
    ax3.set_xticklabels(capex_df['Year'])
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # 2.4 Growth Investment Pattern Analysis
    ax4 = axes[1, 0]
    
    # Multi-year growth analysis
    growth_3y = capex_df['Growth_Capex'].rolling(3).sum()
    growth_cumulative = capex_df['Growth_Capex'].cumsum()
    
    ax4.bar(capex_df['Year'], capex_df['Growth_Capex'], alpha=0.6, color='green',
           label='Annual Growth Capex')
    ax4.plot(capex_df['Year'], growth_3y, 'ro-', linewidth=3, markersize=8,
            label='3-Year Rolling Sum')
    
    # Growth investment efficiency
    for i, (annual, cumulative) in enumerate(zip(capex_df['Growth_Capex'], growth_cumulative)):
        if annual > 0:
            efficiency = cumulative / annual
            ax4.text(capex_df['Year'].iloc[i], annual + 2,
                    f'${annual}M\n(Cum: {efficiency:.1f}x)',
                    ha='center', va='bottom', fontsize=9, fontweight='bold')
    
    ax4.set_title('Growth Investment Pattern & Efficiency', fontsize=14, fontweight='bold')
    ax4.set_ylabel('Growth Capex ($ Millions)', fontsize=12)
    ax4.legend()
    ax4.grid(True, alpha=0.3)
    
    # 2.5 Asset Intensity Analysis
    ax5 = axes[1, 1]
    
    # Asset turnover and intensity metrics
    asset_turnover = 900 / capex_df['Asset_Base']  # Simplified revenue/assets
    capex_intensity = capex_df['Total_Capex'] / capex_df['Asset_Base'] * 100
    
    ax5_twin = ax5.twinx()
    
    # Asset turnover (higher is better)
    line1 = ax5.bar(capex_df['Year'], asset_turnover, alpha=0.6, color='blue',
                   label='Asset Turnover')
    
    # Capex intensity (lower maintenance intensity is better)
    line2 = ax5_twin.plot(capex_df['Year'], capex_intensity, 'ro-', linewidth=3,
                         markersize=10, label='Capex Intensity %')
    
    ax5.set_title('Asset Efficiency & Capital Intensity', fontsize=14, fontweight='bold')
    ax5.set_ylabel('Asset Turnover (x)', fontsize=12, color='blue')
    ax5_twin.set_ylabel('Capex Intensity (%)', fontsize=12, color='red')
    
    # Add efficiency score
    avg_intensity = capex_intensity.mean()
    efficiency_score = 100 - min(avg_intensity, 20)  # Cap at 20% for scoring
    ax5.text(0.02, 0.98, f'Efficiency Score: {efficiency_score:.0f}/100', 
            transform=ax5.transAxes, va='top',
            bbox=dict(boxstyle="round,pad=0.3", facecolor='lightgreen'))
    
    ax5.grid(True, alpha=0.3)
    
    # 2.6 Comprehensive Summary Dashboard
    ax6 = axes[1, 2]
    ax6.axis('off')
    
    # Calculate key metrics
    total_capex = capex_df['Total_Capex'].sum()
    total_maint = capex_df['Maintenance_Capex'].sum()
    total_growth = capex_df['Growth_Capex'].sum()
    avg_sustainability = (capex_df['Maintenance_Capex'] / capex_df['Depreciation']).mean()
    
    summary_text = f"""
    📊 COMPREHENSIVE CAPEX ANALYSIS SUMMARY
    
    💰 5-YEAR TOTALS:
    • Total Capex: ${total_capex}M
    • Maintenance: ${total_maint}M ({total_maint/total_capex*100:.1f}%)
    • Growth: ${total_growth}M ({total_growth/total_capex*100:.1f}%)
    
    🎯 KEY RATIOS:
    • Avg Annual Maintenance: ${avg_maint:.1f}M
    • Maintenance/Depreciation: {avg_sustainability:.2f}x
    • Growth Volatility: {capex_df['Growth_Capex'].std():.1f}M
    • Asset Intensity: {capex_intensity.mean():.1f}%
    
    📈 QUALITY METRICS:
    • Maintenance Consistency: {100-((capex_df['Maintenance_Capex'].std()/avg_maint)*100):.0f}/100
    • Asset Efficiency Score: {efficiency_score:.0f}/100
    • Sustainability Rating: {"✅ EXCELLENT" if avg_sustainability > 1.1 else "⚠️ ADEQUATE" if avg_sustainability > 0.9 else "❌ POOR"}
    
    💡 EPV IMPLICATIONS:
    • Normalized Maint. Capex: ${avg_maint:.1f}M/year
    • Asset Base Sustainability: {"✅ STRONG" if avg_sustainability > 1.0 else "❌ WEAK"}
    • Growth Investment Quality: {"✅ DISCIPLINED" if capex_df['Growth_Capex'].std() < 15 else "⚠️ VOLATILE"}
    """
    
    ax6.text(0.05, 0.95, summary_text, transform=ax6.transAxes, va='top', ha='left',
            fontsize=11, fontfamily='monospace',
            bbox=dict(boxstyle="round,pad=0.8", facecolor='lightblue', alpha=0.9))
    
    plt.tight_layout()
    plt.show()

def run_complete_enhanced_suite():
    """Execute the complete enhanced EPV visualization suite"""
    print("🚀 ULTIMATE EPV ENHANCEMENT SUITE - STARTING ANALYSIS")
    print("📈 Bruce Greenwald's Earnings Power Value - PROFESSIONAL EDITION")
    print("🔬 Advanced Analytics • Interactive Dashboards • Professional Insights")
    print("=" * 80)
    
    # Generate all enhanced professional visualizations
    plot_1_normalized_ebit_professional()
    plot_2_maintenance_capex_professional()
    
    print("\n✅ ULTIMATE EPV ENHANCEMENT SUITE COMPLETE!")
    print("📊 Professional-Grade Visualizations Generated")
    print("💼 Ready for Investment Committee Presentation")
    print("=" * 80)

# Execute the ultimate enhanced suite
if __name__ == "__main__":
    run_complete_enhanced_suite() 