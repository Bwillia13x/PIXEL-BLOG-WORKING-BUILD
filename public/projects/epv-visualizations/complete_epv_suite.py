#!/usr/bin/env python3
"""
Complete EPV Visualization Suite - Enhanced Implementation
Based on Bruce Greenwald's Earnings Power Value methodology
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
from matplotlib.patches import Patch
import warnings
warnings.filterwarnings('ignore')

# Enhanced styling
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

class EnhancedEPVSuite:
    """Complete EPV Analysis Suite with all enhanced visualizations"""
    
    def __init__(self):
        self.setup_data()
        print("🎯 Enhanced EPV Visualization Suite Initialized")
        print("📈 Based on Bruce Greenwald's Earnings Power Value Framework")
        print("=" * 60)
    
    def setup_data(self):
        """Setup comprehensive financial datasets"""
        # 1. EBIT normalization data
        self.ebit_df = pd.DataFrame({
            'Year': range(2014, 2024),
            'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115]
        })
        self.events = {2016: "Major Acquisition", 2018: "Market Downturn", 2021: "Post-Pandemic Rebound"}
        
        # 2. Capex data
        self.capex_df = pd.DataFrame({
            'Year': range(2019, 2024),
            'Total Capex': [80, 95, 75, 110, 85],
            'Maintenance Capex': [50, 55, 52, 60, 58]
        })
        
        # 3. DCF scenarios
        self.dcf_df = pd.DataFrame({
            'Growth Rate': ['0%', '2%', '4%', '6%'],
            'DCF Value': [95.00, 120.00, 165.00, 240.00]
        })
        self.epv_scenarios = {"Conservative": 115.00, "Base Case": 125.00, "Optimistic": 135.00}
        
        # 4. Valuation summary for football field
        self.valuation_data = [
            {'method': 'Earnings Power Value (EPV)', 'low': 122, 'high': 128, 'color': 'green'},
            {'method': 'Discounted Cash Flow (DCF)', 'low': 110, 'high': 165, 'color': 'blue'},
            {'method': 'Comparable Companies', 'low': 135, 'high': 175, 'color': 'purple'},
            {'method': 'Precedent Transactions', 'low': 150, 'high': 190, 'color': 'orange'},
            {'method': 'Asset-Based Valuation', 'low': 90, 'high': 120, 'color': 'brown'},
            {'method': 'Sum-of-the-Parts', 'low': 140, 'high': 170, 'color': 'pink'}
        ]

    def plot_1_normalized_ebit_enhanced(self):
        """1. Enhanced Normalized EBIT Chart with Advanced Analytics"""
        print("\n📊 Generating Enhanced EBIT Normalization Chart...")
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 12))
        
        # Main normalization chart
        avg_ebit = self.ebit_df['EBIT'].mean()
        std_ebit = self.ebit_df['EBIT'].std()
        peak_year = self.ebit_df.loc[self.ebit_df['EBIT'].idxmax(), 'Year']
        trough_year = self.ebit_df.loc[self.ebit_df['EBIT'].idxmin(), 'Year']
        
        colors = ['firebrick' if y == peak_year else 'steelblue' if y == trough_year 
                 else 'darkgrey' for y in self.ebit_df['Year']]
        
        bars = ax1.bar(self.ebit_df['Year'], self.ebit_df['EBIT'], color=colors, alpha=0.8, 
                      edgecolor='black', linewidth=1.5)
        
        # Add normalization bands
        ax1.axhspan(avg_ebit - std_ebit, avg_ebit + std_ebit, alpha=0.2, color='green', 
                   label='Normal Range (±1σ)')
        ax1.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=3,
                   label=f'Normalized EBIT: ${avg_ebit:.1f}M')
        
        # Value labels with styling
        for bar, value in zip(bars, self.ebit_df['EBIT']):
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 3, 
                    f'${value}M', ha='center', va='bottom', fontweight='bold', 
                    fontsize=10, bbox=dict(boxstyle="round,pad=0.2", facecolor='white', alpha=0.8))
        
        # Event annotations
        for year, label in self.events.items():
            if year in self.ebit_df['Year'].values:
                ebit_val = self.ebit_df[self.ebit_df['Year'] == year]['EBIT'].iloc[0]
                ax1.annotate(label, xy=(year, ebit_val), xytext=(year, ebit_val + 30),
                           arrowprops=dict(arrowstyle='->', color='red', lw=2),
                           bbox=dict(boxstyle="round,pad=0.3", facecolor='lightyellow', 
                                   edgecolor='orange', alpha=0.9),
                           fontsize=9, ha='center', fontweight='bold')
        
        ax1.set_title('Enhanced EBIT Normalization Analysis', fontsize=16, fontweight='bold')
        ax1.set_xlabel('Fiscal Year', fontsize=12)
        ax1.set_ylabel('EBIT ($ Millions)', fontsize=12)
        ax1.legend(loc='upper right')
        ax1.grid(True, alpha=0.3)
        
        # Volatility analysis
        rolling_cv = (pd.Series(self.ebit_df['EBIT']).rolling(3).std() / 
                     pd.Series(self.ebit_df['EBIT']).rolling(3).mean())
        ax2.plot(self.ebit_df['Year'][2:], rolling_cv[2:], 'o-', color='orange', 
                linewidth=3, markersize=8, label='3-Year Rolling CV')
        ax2.set_title('EBIT Volatility Trends', fontsize=14, fontweight='bold')
        ax2.set_ylabel('Coefficient of Variation', fontsize=12)
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Cyclical analysis
        cycle_phase = ['Recovery', 'Expansion', 'Peak', 'Contraction', 'Trough', 
                      'Recovery', 'Expansion', 'Peak', 'Recovery', 'Expansion']
        phase_colors = {'Recovery': 'lightgreen', 'Expansion': 'green', 'Peak': 'gold', 
                       'Contraction': 'orange', 'Trough': 'red'}
        colors_cycle = [phase_colors[phase] for phase in cycle_phase]
        
        ax3.bar(self.ebit_df['Year'], self.ebit_df['EBIT'], color=colors_cycle, alpha=0.7)
        ax3.set_title('Business Cycle Classification', fontsize=14, fontweight='bold')
        ax3.set_ylabel('EBIT ($ Millions)', fontsize=12)
        
        # Create legend for cycle phases
        legend_elements = [Patch(facecolor=color, label=phase) 
                          for phase, color in phase_colors.items()]
        ax3.legend(handles=legend_elements, loc='upper right')
        ax3.grid(True, alpha=0.3)
        
        # Statistical summary
        stats_text = f"""
        Statistical Summary:
        • Mean: ${avg_ebit:.1f}M
        • Std Dev: ${std_ebit:.1f}M
        • CV: {(std_ebit/avg_ebit)*100:.1f}%
        • Min: ${self.ebit_df['EBIT'].min()}M
        • Max: ${self.ebit_df['EBIT'].max()}M
        • Normalized Range: ${avg_ebit-std_ebit:.1f}M - ${avg_ebit+std_ebit:.1f}M
        """
        ax4.text(0.1, 0.5, stats_text, transform=ax4.transAxes, fontsize=11,
                bbox=dict(boxstyle="round,pad=0.5", facecolor='lightblue', alpha=0.8),
                verticalalignment='center')
        ax4.set_title('Normalization Statistics', fontsize=14, fontweight='bold')
        ax4.axis('off')
        
        plt.tight_layout()
        plt.show()

    def plot_2_capex_breakdown_enhanced(self):
        """2. Enhanced Capex Breakdown with Advanced Metrics"""
        print("\n📊 Generating Enhanced Capex Analysis...")
        
        # Prepare data
        self.capex_df['Growth Capex'] = self.capex_df['Total Capex'] - self.capex_df['Maintenance Capex']
        avg_maint = self.capex_df['Maintenance Capex'].mean()
        
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(18, 12))
        
        # Enhanced stacked bar chart
        p1 = ax1.bar(self.capex_df['Year'], self.capex_df['Maintenance Capex'], 
                    label='Maintenance Capex', color='darkcyan', alpha=0.8, edgecolor='black')
        p2 = ax1.bar(self.capex_df['Year'], self.capex_df['Growth Capex'], 
                    bottom=self.capex_df['Maintenance Capex'], 
                    label='Growth Capex', color='lightcoral', alpha=0.8, edgecolor='black')
        
        ax1.axhline(avg_maint, color='darkblue', linestyle='--', linewidth=3,
                   label=f'Avg Maintenance: ${avg_maint:.1f}M')
        
        # Enhanced data labels
        for i, row in self.capex_df.iterrows():
            # Maintenance capex label
            ax1.text(row['Year'], row['Maintenance Capex']/2, 
                    f"${row['Maintenance Capex']}M", ha='center', va='center', 
                    fontweight='bold', color='white', fontsize=10)
            # Growth capex label
            ax1.text(row['Year'], row['Maintenance Capex'] + row['Growth Capex']/2, 
                    f"${row['Growth Capex']}M", ha='center', va='center', 
                    fontweight='bold', color='white', fontsize=10)
            # Total label
            ax1.text(row['Year'], row['Total Capex'] + 3, 
                    f"Total: ${row['Total Capex']}M", ha='center', va='bottom', 
                    fontweight='bold', color='black', fontsize=10,
                    bbox=dict(boxstyle="round,pad=0.2", facecolor='yellow', alpha=0.7))
        
        ax1.set_title('Enhanced Capex Breakdown Analysis', fontsize=16, fontweight='bold')
        ax1.set_ylabel('Capital Expenditure ($ Millions)', fontsize=12)
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # Capex ratios
        maint_ratio = self.capex_df['Maintenance Capex'] / self.capex_df['Total Capex'] * 100
        ax2.plot(self.capex_df['Year'], maint_ratio, 'o-', linewidth=3, markersize=10, 
                color='purple', label='Maintenance %')
        ax2.axhline(maint_ratio.mean(), color='red', linestyle='--', alpha=0.7,
                   label=f'Avg: {maint_ratio.mean():.1f}%')
        ax2.set_title('Maintenance Capex Ratio Trends', fontsize=14, fontweight='bold')
        ax2.set_ylabel('Maintenance Capex (%)', fontsize=12)
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Growth investment efficiency
        growth_cumulative = self.capex_df['Growth Capex'].cumsum()
        ax3.bar(self.capex_df['Year'], self.capex_df['Growth Capex'], alpha=0.6, 
               color='green', label='Annual Growth Capex')
        ax3.plot(self.capex_df['Year'], growth_cumulative, 'ro-', linewidth=3, 
                markersize=8, label='Cumulative Growth Investment')
        ax3.set_title('Growth Investment Pattern', fontsize=14, fontweight='bold')
        ax3.set_ylabel('Growth Capex ($ Millions)', fontsize=12)
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # Summary metrics
        total_capex = self.capex_df['Total Capex'].sum()
        total_maint = self.capex_df['Maintenance Capex'].sum()
        total_growth = self.capex_df['Growth Capex'].sum()
        
        summary_text = f"""
        5-Year Capex Summary:
        
        • Total Capex: ${total_capex}M
        • Maintenance: ${total_maint}M ({total_maint/total_capex*100:.1f}%)
        • Growth: ${total_growth}M ({total_growth/total_capex*100:.1f}%)
        
        • Avg Annual Maintenance: ${avg_maint:.1f}M
        • Growth Volatility: {self.capex_df['Growth Capex'].std():.1f}M
        
        Key Insight: {avg_maint/total_maint*5*100:.1f}% consistency in 
        maintenance requirements
        """
        
        ax4.text(0.05, 0.5, summary_text, transform=ax4.transAxes, fontsize=11,
                bbox=dict(boxstyle="round,pad=0.5", facecolor='lightgreen', alpha=0.8),
                verticalalignment='center')
        ax4.set_title('Capex Investment Summary', fontsize=14, fontweight='bold')
        ax4.axis('off')
        
        plt.tight_layout()
        plt.show()

    def plot_3_epv_dcf_interactive_enhanced(self):
        """3. Enhanced Interactive EPV vs DCF Analysis"""
        print("\n📊 Generating Enhanced EPV vs DCF Interactive Analysis...")
        
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('EPV Stability vs DCF Growth Sensitivity', 
                          'Terminal Value Multiples', 
                          'Sensitivity Analysis', 
                          'Risk-Return Profile'),
            specs=[[{"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"secondary_y": False}]]
        )
        
        # Main comparison with enhanced styling
        colors = ['#1f77b4', '#ff7f0e', '#d62728', '#9467bd']
        fig.add_trace(
            go.Bar(x=self.dcf_df['Growth Rate'], y=self.dcf_df['DCF Value'],
                  name='DCF Valuation', marker_color=colors, opacity=0.8,
                  text=self.dcf_df['DCF Value'], textposition='outside',
                  texttemplate='$%{text:.0f}',
                  hovertemplate='<b>DCF Valuation</b><br>Growth: %{x}<br>Value: $%{y:.0f}<extra></extra>'),
            row=1, col=1
        )
        
        # EPV scenarios as horizontal lines with annotations
        epv_colors = ['darkgreen', 'green', 'lightgreen']
        for i, (name, value) in enumerate(self.epv_scenarios.items()):
            fig.add_hline(y=value, line_dash="dash", line_color=epv_colors[i], 
                         line_width=3, opacity=0.8,
                         annotation_text=f"EPV {name}: ${value:.0f}",
                         annotation_position="right", row=1, col=1)
        
        # Terminal multiples analysis
        terminal_multiples = [val/10 for val in self.dcf_df['DCF Value']]  # Simplified calculation
        fig.add_trace(
            go.Scatter(x=self.dcf_df['Growth Rate'], y=terminal_multiples,
                      mode='lines+markers', name='Implied Terminal Multiple',
                      line=dict(color='red', width=4), marker=dict(size=10)),
            row=1, col=2
        )
        
        # Sensitivity tornado chart
        base_dcf = self.dcf_df['DCF Value'].iloc[0]
        sensitivity_data = [val - base_dcf for val in self.dcf_df['DCF Value']]
        
        fig.add_trace(
            go.Waterfall(x=self.dcf_df['Growth Rate'], y=sensitivity_data,
                        name="Growth Impact on Valuation",
                        connector={"line": {"color": "rgb(63, 63, 63)"}},
                        increasing={"marker": {"color": "green"}},
                        decreasing={"marker": {"color": "red"}},
                        textposition="outside",
                        texttemplate='%{y:+.0f}'),
            row=2, col=1
        )
        
        # Risk-return scatter
        growth_rates = [0, 2, 4, 6]
        uncertainty = [10, 25, 45, 80]  # Increasing uncertainty with growth
        
        fig.add_trace(
            go.Scatter(x=uncertainty, y=self.dcf_df['DCF Value'],
                      mode='markers+text', name='Risk-Return Profile',
                      marker=dict(size=15, color=colors, opacity=0.8),
                      text=[f"{g}%" for g in growth_rates],
                      textposition="middle center",
                      hovertemplate='<b>Growth: %{text}</b><br>Uncertainty: %{x}%<br>Value: $%{y:.0f}<extra></extra>'),
            row=2, col=2
        )
        
        # Add EPV as low-risk reference point
        fig.add_trace(
            go.Scatter(x=[5], y=[125], mode='markers+text',
                      marker=dict(size=20, color='green', symbol='star'),
                      text=['EPV'], textposition="top center",
                      name='EPV (Low Risk)', showlegend=False),
            row=2, col=2
        )
        
        fig.update_layout(
            title_text="Enhanced EPV vs DCF Comprehensive Analysis",
            showlegend=True,
            height=800,
            template='plotly_white'
        )
        
        fig.show()

    def plot_4_wacc_sensitivity_enhanced(self):
        """4. Enhanced WACC Sensitivity with Multiple Scenarios"""
        print("\n📊 Generating Enhanced WACC Sensitivity Analysis...")
        
        wacc_range = np.arange(0.06, 0.121, 0.005)
        normalized_earnings = 10.00  # Per share
        market_price = 105.00
        
        # Multiple scenario analysis
        scenarios = {
            'Conservative (90% of Base)': normalized_earnings * 0.9,
            'Base Case': normalized_earnings,
            'Optimistic (110% of Base)': normalized_earnings * 1.1,
            'Bull Case (125% of Base)': normalized_earnings * 1.25
        }
        
        fig = go.Figure()
        
        colors = ['red', 'blue', 'green', 'purple']
        for i, (scenario, earnings) in enumerate(scenarios.items()):
            epv_values = earnings / wacc_range
            
            fig.add_trace(go.Scatter(
                x=wacc_range, y=epv_values,
                mode='lines+markers',
                name=scenario,
                line=dict(color=colors[i], width=3),
                marker=dict(size=8),
                hovertemplate=f'<b>{scenario}</b><br>WACC: %{{x:.1%}}<br>EPV: $%{{y:.2f}}<extra></extra>'
            ))
        
        # Market price reference with bands
        fig.add_hline(y=market_price, line_dash="solid", line_color="black", line_width=3,
                     annotation_text=f"Current Market Price: ${market_price:.0f}",
                     annotation_position="bottom right")
        
        # Value zones with enhanced styling
        fig.add_hrect(y0=market_price*1.25, y1=300, fillcolor="rgba(0, 255, 0, 0.15)", 
                     line_width=0, annotation_text="Strong Buy Zone (+25%)",
                     annotation_position="top left")
        fig.add_hrect(y0=market_price*1.1, y1=market_price*1.25, fillcolor="rgba(144, 238, 144, 0.15)", 
                     line_width=0, annotation_text="Buy Zone (+10%)")
        fig.add_hrect(y0=market_price*0.9, y1=market_price*1.1, fillcolor="rgba(255, 255, 0, 0.15)", 
                     line_width=0, annotation_text="Fair Value Zone (±10%)")
        fig.add_hrect(y0=50, y1=market_price*0.9, fillcolor="rgba(255, 0, 0, 0.15)", 
                     line_width=0, annotation_text="Overvalued Zone")
        
        # Add dynamic slider for WACC selection
        steps = []
        for wacc in wacc_range[::2]:  # Every other value for cleaner slider
            step = dict(
                method="relayout",
                args=[{"shapes": [dict(
                    type='line', x0=wacc, x1=wacc, y0=50, y1=300,
                    line=dict(color='orange', width=3, dash='dot')
                )]}],
                label=f"{wacc:.1%}"
            )
            steps.append(step)
        
        sliders = [dict(
            active=len(steps)//2,
            currentvalue={"prefix": "WACC: "},
            pad={"t": 50},
            steps=steps
        )]
        
        fig.update_layout(
            title_text='Enhanced WACC Sensitivity Analysis with Investment Zones',
            xaxis_title='Weighted Average Cost of Capital (WACC)',
            yaxis_title='EPV per Share ($)',
            xaxis=dict(tickformat='.1%'),
            template='plotly_white',
            hovermode='x unified',
            sliders=sliders,
            width=1000,
            height=600
        )
        
        fig.show()

    def plot_5_epv_waterfall_enhanced(self):
        """5. Enhanced EPV Waterfall with Multiple Scenarios"""
        print("\n📊 Generating Enhanced EPV Waterfall Analysis...")
        
        scenarios = ['Conservative', 'Base Case', 'Optimistic']
        params = [
            {'ebit': 1200, 'tax': 0.27, 'capex': 320, 'debt': 2200, 'wacc': 0.095},
            {'ebit': 1500, 'tax': 0.25, 'capex': 400, 'debt': 2000, 'wacc': 0.08},
            {'ebit': 1800, 'tax': 0.23, 'capex': 480, 'debt': 1800, 'wacc': 0.07}
        ]
        
        fig = make_subplots(
            rows=1, cols=3,
            subplot_titles=[f'{scenario} Scenario<br>EPV: ${(params[i]["ebit"]*(1-params[i]["tax"])-params[i]["capex"])/params[i]["wacc"]/100:.1f}' 
                          for i, scenario in enumerate(scenarios)],
            specs=[[{"type": "waterfall"} for _ in range(3)]]
        )
        
        for i, (scenario, param) in enumerate(zip(scenarios, params)):
            # Enhanced calculations
            ebit = param['ebit']
            tax_rate = param['tax']
            capex = param['capex']
            net_debt = param['debt']
            wacc = param['wacc']
            shares = 100
            
            cash_taxes = ebit * tax_rate
            nopat = ebit - cash_taxes
            distributable_earnings = nopat - capex
            enterprise_value = distributable_earnings / wacc
            equity_value = enterprise_value - net_debt
            epv_per_share = equity_value / shares
            
            # Enhanced waterfall with more detail
            fig.add_trace(
                go.Waterfall(
                    name=f"{scenario}",
                    orientation="v",
                    measure=["absolute", "relative", "total", "relative", "total", "relative", "total"],
                    x=["EBIT", f"Taxes\n({tax_rate:.0%})", "NOPAT", "Maintenance\nCapex", 
                       "Distributable\nEarnings", f"Net Debt\nAdjustment", f"EPV/Share\n(÷{shares}M)"],
                    text=[f"${v:,.0f}M" if v > 100 else f"${v:.1f}" 
                          for v in [ebit, -cash_taxes, nopat, -capex, distributable_earnings, -net_debt/shares, epv_per_share]],
                    y=[ebit, -cash_taxes, None, -capex, None, -net_debt/shares, None],
                    connector={"line": {"color": "rgb(63, 63, 63)"}},
                    totals={"marker": {"color": "darkblue", "line": {"color": "white", "width": 2}}},
                    decreasing={"marker": {"color": "maroon", "line": {"color": "white", "width": 2}}},
                    increasing={"marker": {"color": "green", "line": {"color": "white", "width": 2}}},
                    textposition="outside",
                    textfont={"size": 10}
                ),
                row=1, col=i+1
            )
            
            # Add scenario parameters as annotation
            scenario_text = f"WACC: {wacc:.1%}<br>Tax Rate: {tax_rate:.0%}<br>Debt: ${net_debt:,.0f}M"
            fig.add_annotation(
                x=3, y=ebit*0.8, text=scenario_text, showarrow=False,
                xref=f"x{i+1}", yref=f"y{i+1}",
                bgcolor="lightgray", bordercolor="black", borderwidth=1,
                font=dict(size=9), row=1, col=i+1
            )
        
        fig.update_layout(
            title_text="Enhanced EPV Waterfall Analysis - Scenario Comparison",
            showlegend=False,
            height=700,
            template='plotly_white'
        )
        
        fig.show()

    def plot_6_football_field_enhanced(self):
        """6. Enhanced Football Field with Confidence Intervals and Risk Metrics"""
        print("\n📊 Generating Enhanced Football Field Valuation...")
        
        # Enhanced valuation data with confidence metrics
        enhanced_valuation = [
            {'method': 'EPV Conservative', 'low': 115, 'mid': 122, 'high': 128, 'confidence': 95, 'risk': 'Low'},
            {'method': 'EPV Base Case', 'low': 122, 'mid': 125, 'high': 135, 'confidence': 90, 'risk': 'Low'},
            {'method': 'DCF (0% Growth)', 'low': 90, 'mid': 110, 'high': 130, 'confidence': 75, 'risk': 'Medium'},
            {'method': 'DCF (4% Growth)', 'low': 120, 'mid': 165, 'high': 220, 'confidence': 60, 'risk': 'High'},
            {'method': 'Comparable Companies', 'low': 130, 'mid': 155, 'high': 180, 'confidence': 70, 'risk': 'Medium'},
            {'method': 'Precedent Transactions', 'low': 140, 'mid': 165, 'high': 195, 'confidence': 50, 'risk': 'High'},
            {'method': 'Asset-Based (Liquidation)', 'low': 80, 'mid': 95, 'high': 110, 'confidence': 85, 'risk': 'Low'},
            {'method': 'Sum-of-the-Parts', 'low': 135, 'mid': 155, 'high': 175, 'confidence': 65, 'risk': 'Medium'}
        ]
        
        fig = go.Figure()
        
        colors = {'Low': 'green', 'Medium': 'orange', 'High': 'red'}
        symbols = {'Low': 'circle', 'Medium': 'square', 'High': 'diamond'}
        
        for i, item in enumerate(enhanced_valuation):
            color = colors[item['risk']]
            symbol = symbols[item['risk']]
            
            # Main valuation range
            fig.add_trace(go.Scatter(
                x=[item['mid']],
                y=[item['method']],
                error_x=dict(
                    type='data',
                    symmetric=False,
                    array=[item['high'] - item['mid']],
                    arrayminus=[item['mid'] - item['low']],
                    thickness=12,
                    color=color
                ),
                mode='markers',
                marker=dict(symbol=symbol, size=18, color=color, 
                           line=dict(width=3, color='black')),
                name=f"{item['risk']} Risk Methods",
                legendgroup=item['risk'],
                showlegend=i==0 or (i==2 and item['risk']=='Medium') or (i==3 and item['risk']=='High'),
                hovertemplate=(f"<b>{item['method']}</b><br>"
                              f"Range: ${item['low']:.0f} - ${item['high']:.0f}<br>"
                              f"Midpoint: ${item['mid']:.0f}<br>"
                              f"Confidence: {item['confidence']}%<br>"
                              f"Risk Level: {item['risk']}<extra></extra>")
            ))
            
            # Confidence intervals as text
            fig.add_annotation(
                x=item['high'] + 15,
                y=item['method'],
                text=f"{item['confidence']}%",
                showarrow=False,
                font=dict(size=10, color=color, weight='bold')
            )
        
        # Market dynamics
        current_price = 105
        target_prices = [130, 150, 170]  # Analyst targets
        
        # Current price line
        fig.add_vline(x=current_price, line_width=4, line_dash="solid", 
                     line_color="black", opacity=0.9,
                     annotation_text=f"Current Price: ${current_price}",
                     annotation_position="top right",
                     annotation_font=dict(size=14, color="black"))
        
        # Analyst target range
        fig.add_vrect(x0=min(target_prices), x1=max(target_prices), 
                     fillcolor="blue", opacity=0.1, line_width=0,
                     annotation_text="Analyst Targets", annotation_position="top left")
        
        # Investment zones with enhanced styling
        zones = [
            {'x0': current_price*1.3, 'x1': 250, 'fillcolor': 'green', 'opacity': 0.15, 'label': 'Strong Buy (+30%)'},
            {'x0': current_price*1.15, 'x1': current_price*1.3, 'fillcolor': 'lightgreen', 'opacity': 0.15, 'label': 'Buy (+15%)'},
            {'x0': current_price*0.9, 'x1': current_price*1.15, 'fillcolor': 'yellow', 'opacity': 0.15, 'label': 'Hold (±15%)'},
            {'x0': 60, 'x1': current_price*0.9, 'fillcolor': 'red', 'opacity': 0.15, 'label': 'Overvalued'}
        ]
        
        for zone in zones:
            fig.add_vrect(**{k: v for k, v in zone.items() if k not in ['label']}, line_width=0)
        
        fig.update_layout(
            title_text='Enhanced Valuation Summary - "Football Field" with Risk Assessment',
            xaxis_title='Valuation per Share ($)',
            yaxis_title='Valuation Method',
            template='plotly_white',
            showlegend=True,
            legend=dict(x=0.02, y=0.98),
            width=1200,
            height=700,
            font=dict(size=12)
        )
        
        fig.show()

    def generate_complete_analysis(self):
        """Generate the complete enhanced EPV analysis suite"""
        print("\n🚀 STARTING COMPLETE ENHANCED EPV ANALYSIS")
        print("📈 Bruce Greenwald's Earnings Power Value Framework")
        print("🔬 Advanced Analytics & Interactive Visualizations")
        print("=" * 70)
        
        # Generate all enhanced visualizations
        self.plot_1_normalized_ebit_enhanced()
        self.plot_2_capex_breakdown_enhanced() 
        self.plot_3_epv_dcf_interactive_enhanced()
        self.plot_4_wacc_sensitivity_enhanced()
        self.plot_5_epv_waterfall_enhanced()
        self.plot_6_football_field_enhanced()
        
        print("\n✅ COMPLETE ENHANCED EPV ANALYSIS FINISHED!")
        print("📊 All 6 Enhanced Visualizations Generated Successfully")
        print("💡 Ready for Investment Decision Making")
        print("=" * 70)

# Execute the complete analysis
if __name__ == "__main__":
    suite = EnhancedEPVSuite()
    suite.generate_complete_analysis() 