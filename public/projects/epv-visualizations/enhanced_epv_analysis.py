#!/usr/bin/env python3
"""
Enhanced EPV (Earnings Power Value) Analysis Suite
Based on Bruce Greenwald's methodology with advanced visualizations
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.figure_factory as ff
from matplotlib.patches import Patch, Rectangle
import warnings
warnings.filterwarnings('ignore')

# Set styling
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

class EPVAnalyzer:
    """Enhanced EPV Analysis Class with comprehensive visualization suite"""
    
    def __init__(self):
        self.setup_sample_data()
        
    def setup_sample_data(self):
        """Initialize comprehensive sample financial data"""
        # Historical EBIT data
        self.ebit_data = pd.DataFrame({
            'Year': list(range(2014, 2024)),
            'EBIT': [105, 120, 145, 130, 95, 80, 110, 155, 125, 115],
            'Revenue': [800, 920, 1100, 980, 750, 650, 850, 1200, 980, 900],
            'EBIT_Margin': [13.1, 13.0, 13.2, 13.3, 12.7, 12.3, 12.9, 12.9, 12.8, 12.8]
        })
        
        # Capex breakdown data
        self.capex_data = pd.DataFrame({
            'Year': list(range(2019, 2024)),
            'Total_Capex': [80, 95, 75, 110, 85],
            'Maintenance_Capex': [50, 55, 52, 60, 58],
            'Growth_Capex': [30, 40, 23, 50, 27],
            'Depreciation': [45, 48, 50, 52, 55]
        })
        
        # DCF scenario data
        self.dcf_scenarios = pd.DataFrame({
            'Growth_Rate': ['0%', '2%', '4%', '6%', '8%'],
            'DCF_Value': [95.00, 120.00, 165.00, 240.00, 385.00],
            'Terminal_Multiple': [12.5, 15.0, 20.0, 30.0, 48.1]
        })
        
        # EPV scenarios
        self.epv_scenarios = {
            "Conservative": 115.00,
            "Base Case": 125.00, 
            "Optimistic": 135.00,
            "Stress Test": 95.00
        }
        
        # Historical valuation data
        dates = pd.date_range('2020-01-01', '2024-01-01', freq='Q')
        n_dates = len(dates)
        self.historical_data = pd.DataFrame({
            'Date': dates,
            'EPV': np.random.normal(125, 15, n_dates),
            'Market_Price': np.random.normal(105, 25, n_dates),
            'P_E_Ratio': np.random.normal(18, 4, n_dates),
            'EV_EBITDA': np.random.normal(12, 3, n_dates)
        })
        
        # Peer comparison data
        self.peer_data = pd.DataFrame({
            'Company': ['Target Co', 'Peer A', 'Peer B', 'Peer C', 'Peer D', 'Peer E'],
            'EPV': [125, 95, 140, 78, 110, 165],
            'Market_Price': [105, 102, 128, 85, 98, 155],
            'ROIC': [15.2, 12.8, 18.1, 9.4, 13.6, 22.3],
            'Debt_Equity': [0.3, 0.5, 0.2, 0.8, 0.4, 0.1],
            'Revenue_Growth_5Y': [8.2, 5.1, 12.3, 2.8, 6.9, 15.7]
        })
        
        # Monte Carlo parameters
        self.mc_params = {
            'base_ebit': 125,
            'ebit_volatility': 0.20,
            'wacc_base': 0.09,
            'wacc_volatility': 0.015,
            'tax_rate': 0.25,
            'maint_capex_pct': 0.06,
            'simulations': 10000
        }
        
        # Events for annotations
        self.events = {
            2016: "Major Acquisition", 
            2018: "Market Downturn", 
            2021: "Post-Pandemic Rebound",
            2023: "Supply Chain Recovery"
        }

    def plot_normalized_ebit_advanced(self):
        """Enhanced EBIT normalization chart with advanced features"""
        fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(20, 14))
        
        # Main EBIT chart
        avg_ebit = self.ebit_data['EBIT'].mean()
        std_ebit = self.ebit_data['EBIT'].std()
        peak_year = self.ebit_data.loc[self.ebit_data['EBIT'].idxmax(), 'Year']
        trough_year = self.ebit_data.loc[self.ebit_data['EBIT'].idxmin(), 'Year']
        
        colors = ['firebrick' if y == peak_year else 'steelblue' if y == trough_year else 'darkgrey' 
                 for y in self.ebit_data['Year']]
        
        bars = ax1.bar(self.ebit_data['Year'], self.ebit_data['EBIT'], color=colors, alpha=0.8, edgecolor='black')
        
        # Add confidence bands
        ax1.axhspan(avg_ebit - std_ebit, avg_ebit + std_ebit, alpha=0.2, color='green', label='±1 Std Dev')
        ax1.axhline(avg_ebit, color='darkgreen', linestyle='--', linewidth=3,
                   label=f'Normalized EBIT: ${avg_ebit:.1f}M')
        
        # Add value labels on bars
        for bar, value in zip(bars, self.ebit_data['EBIT']):
            ax1.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 2, 
                    f'${value}M', ha='center', va='bottom', fontweight='bold', fontsize=10)
        
        # Annotations for events
        for year, label in self.events.items():
            if year in self.ebit_data['Year'].values:
                ebit_val = self.ebit_data[self.ebit_data['Year'] == year]['EBIT'].iloc[0]
                ax1.annotate(label, xy=(year, ebit_val), xytext=(year, ebit_val + 25),
                           arrowprops=dict(arrowstyle='->', color='black', lw=1.5),
                           bbox=dict(boxstyle="round,pad=0.3", facecolor='lightyellow', alpha=0.8),
                           fontsize=9, ha='center')
        
        ax1.set_title('EBIT Normalization Over Business Cycle', fontsize=16, fontweight='bold')
        ax1.set_xlabel('Fiscal Year', fontsize=12)
        ax1.set_ylabel('EBIT ($ Millions)', fontsize=12)
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # EBIT margin stability
        ax2.plot(self.ebit_data['Year'], self.ebit_data['EBIT_Margin'], 'o-', 
                linewidth=3, markersize=8, color='darkblue', label='EBIT Margin')
        ax2.axhline(self.ebit_data['EBIT_Margin'].mean(), color='red', linestyle='--', alpha=0.7,
                   label=f"Avg Margin: {self.ebit_data['EBIT_Margin'].mean():.1f}%")
        ax2.set_title('EBIT Margin Consistency', fontsize=14, fontweight='bold')
        ax2.set_ylabel('EBIT Margin (%)', fontsize=12)
        ax2.legend()
        ax2.grid(True, alpha=0.3)
        
        # Revenue vs EBIT relationship
        ax3.scatter(self.ebit_data['Revenue'], self.ebit_data['EBIT'], s=100, alpha=0.7, c='purple')
        z = np.polyfit(self.ebit_data['Revenue'], self.ebit_data['EBIT'], 1)
        p = np.poly1d(z)
        ax3.plot(self.ebit_data['Revenue'], p(self.ebit_data['Revenue']), "r--", alpha=0.8, linewidth=2)
        
        # Add correlation coefficient
        corr = self.ebit_data['Revenue'].corr(self.ebit_data['EBIT'])
        ax3.text(0.05, 0.95, f'Correlation: {corr:.3f}', transform=ax3.transAxes, 
                bbox=dict(boxstyle="round", facecolor='wheat', alpha=0.8), fontsize=12)
        
        ax3.set_title('Revenue-EBIT Relationship', fontsize=14, fontweight='bold')
        ax3.set_xlabel('Revenue ($ Millions)', fontsize=12)
        ax3.set_ylabel('EBIT ($ Millions)', fontsize=12)
        ax3.grid(True, alpha=0.3)
        
        # EBIT volatility analysis
        rolling_std = pd.Series(self.ebit_data['EBIT']).rolling(window=3).std()
        ax4.plot(self.ebit_data['Year'][2:], rolling_std[2:], 'o-', color='orange', linewidth=2, markersize=6)
        ax4.set_title('3-Year Rolling EBIT Volatility', fontsize=14, fontweight='bold')
        ax4.set_ylabel('EBIT Std Dev ($ Millions)', fontsize=12)
        ax4.grid(True, alpha=0.3)
        
        plt.tight_layout()
        plt.show()

    def plot_interactive_epv_dcf_enhanced(self):
        """Enhanced interactive EPV vs DCF comparison"""
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('EPV vs DCF Sensitivity', 'Terminal Value Analysis', 
                          'Growth Assumptions Impact', 'Valuation Method Comparison'),
            specs=[[{"secondary_y": False}, {"secondary_y": True}],
                   [{"secondary_y": False}, {"secondary_y": False}]]
        )
        
        # Main comparison chart
        colors = ['#1f77b4', '#ff7f0e', '#d62728', '#9467bd', '#2ca02c']
        fig.add_trace(
            go.Bar(x=self.dcf_scenarios['Growth_Rate'], y=self.dcf_scenarios['DCF_Value'],
                  name='DCF Valuation', marker_color=colors, opacity=0.8),
            row=1, col=1
        )
        
        # Add EPV ranges
        for i, (name, value) in enumerate(self.epv_scenarios.items()):
            fig.add_hline(y=value, line_dash="dash", line_color="green", opacity=0.7,
                         annotation_text=f"EPV {name}: ${value:.0f}", row=1, col=1)
        
        # Terminal multiple analysis
        fig.add_trace(
            go.Scatter(x=self.dcf_scenarios['Growth_Rate'], y=self.dcf_scenarios['Terminal_Multiple'],
                      mode='lines+markers', name='Terminal Multiple', line=dict(color='red', width=3)),
            row=1, col=2
        )
        
        # Growth impact waterfall
        base_dcf = self.dcf_scenarios['DCF_Value'].iloc[0]
        growth_impact = [val - base_dcf for val in self.dcf_scenarios['DCF_Value']]
        
        fig.add_trace(
            go.Waterfall(x=self.dcf_scenarios['Growth_Rate'], y=growth_impact,
                        name="Growth Impact", connector={"line": {"color": "rgb(63, 63, 63)"}},
                        increasing={"marker": {"color": "green"}},
                        decreasing={"marker": {"color": "red"}}),
            row=2, col=1
        )
        
        # Method comparison radar
        methods = ['EPV Conservative', 'EPV Base', 'DCF 0%', 'DCF 4%', 'DCF 6%']
        values = [115, 125, 95, 165, 240]
        
        fig.add_trace(
            go.Bar(x=methods, y=values, name='Valuation Methods',
                  marker_color=['green', 'green', 'blue', 'blue', 'blue']),
            row=2, col=2
        )
        
        fig.update_layout(
            title_text="Enhanced EPV vs DCF Analysis Dashboard",
            showlegend=True,
            height=800
        )
        
        fig.show()

    def plot_monte_carlo_simulation(self):
        """Monte Carlo simulation for EPV distribution"""
        np.random.seed(42)
        
        # Parameters
        n_sims = self.mc_params['simulations']
        base_ebit = self.mc_params['base_ebit']
        ebit_vol = self.mc_params['ebit_volatility']
        base_wacc = self.mc_params['wacc_base']
        wacc_vol = self.mc_params['wacc_volatility']
        
        # Generate random variables
        ebit_draws = np.random.normal(base_ebit, base_ebit * ebit_vol, n_sims)
        wacc_draws = np.random.normal(base_wacc, wacc_vol, n_sims)
        tax_rate_draws = np.random.normal(0.25, 0.02, n_sims)
        
        # Ensure reasonable bounds
        ebit_draws = np.clip(ebit_draws, base_ebit * 0.5, base_ebit * 2)
        wacc_draws = np.clip(wacc_draws, 0.05, 0.15)
        tax_rate_draws = np.clip(tax_rate_draws, 0.15, 0.35)
        
        # Calculate EPV distribution
        epv_results = []
        for ebit, wacc, tax_rate in zip(ebit_draws, wacc_draws, tax_rate_draws):
            after_tax_earnings = ebit * (1 - tax_rate)
            maintenance_capex = ebit * self.mc_params['maint_capex_pct']
            distributable_earnings = after_tax_earnings - maintenance_capex
            enterprise_value = distributable_earnings / wacc
            epv_per_share = enterprise_value / 100  # 100M shares
            epv_results.append(epv_per_share)
        
        epv_results = np.array(epv_results)
        
        # Create comprehensive visualization
        fig = make_subplots(
            rows=2, cols=2,
            subplot_titles=('EPV Distribution', 'EBIT vs WACC Impact', 
                          'Percentile Analysis', 'Risk Metrics'),
            specs=[[{"secondary_y": False}, {"secondary_y": False}],
                   [{"secondary_y": False}, {"secondary_y": False}]]
        )
        
        # Histogram
        fig.add_trace(
            go.Histogram(x=epv_results, nbinsx=50, name='EPV Distribution',
                        opacity=0.7, marker_color='skyblue'),
            row=1, col=1
        )
        
        # Add percentile lines
        percentiles = [10, 25, 50, 75, 90]
        p_values = np.percentile(epv_results, percentiles)
        for p, val in zip(percentiles, p_values):
            fig.add_vline(x=val, line_dash="dash", opacity=0.7,
                         annotation_text=f"P{p}: ${val:.0f}", row=1, col=1)
        
        # EBIT vs WACC scatter
        fig.add_trace(
            go.Scatter(x=wacc_draws[:1000], y=ebit_draws[:1000], 
                      mode='markers', marker=dict(size=5, opacity=0.6),
                      name='EBIT vs WACC'),
            row=1, col=2
        )
        
        # Percentile analysis
        percentile_range = range(1, 100)
        percentile_values = [np.percentile(epv_results, p) for p in percentile_range]
        fig.add_trace(
            go.Scatter(x=list(percentile_range), y=percentile_values,
                      mode='lines', name='Percentile Curve', line=dict(width=3)),
            row=2, col=1
        )
        
        # Risk metrics
        current_price = 105
        upside_prob = (epv_results > current_price).mean() * 100
        downside_risk = max(0, current_price - np.percentile(epv_results, 10))
        
        risk_metrics = ['Mean EPV', 'Std Dev', 'Upside Prob', 'VaR (10%)']
        risk_values = [np.mean(epv_results), np.std(epv_results), upside_prob, downside_risk]
        
        fig.add_trace(
            go.Bar(x=risk_metrics, y=risk_values, name='Risk Metrics',
                  marker_color=['green', 'orange', 'blue', 'red']),
            row=2, col=2
        )
        
        fig.update_layout(
            title_text=f"Monte Carlo EPV Analysis ({n_sims:,} Simulations)",
            showlegend=False,
            height=800
        )
        
        fig.show()
        
        # Print summary statistics
        print("\n" + "="*50)
        print("MONTE CARLO EPV ANALYSIS RESULTS")
        print("="*50)
        print(f"Mean EPV: ${np.mean(epv_results):.2f}")
        print(f"Median EPV: ${np.median(epv_results):.2f}")
        print(f"Standard Deviation: ${np.std(epv_results):.2f}")
        print(f"25th Percentile: ${np.percentile(epv_results, 25):.2f}")
        print(f"75th Percentile: ${np.percentile(epv_results, 75):.2f}")
        print(f"Probability of Upside: {upside_prob:.1f}%")
        print(f"Value at Risk (10%): ${downside_risk:.2f}")
        print("="*50)

    def generate_comprehensive_report(self):
        """Generate all visualizations in sequence"""
        print("🚀 GENERATING COMPREHENSIVE EPV ANALYSIS REPORT")
        print("=" * 60)
        
        print("\n📊 1. Advanced EBIT Normalization Analysis...")
        self.plot_normalized_ebit_advanced()
        
        print("\n📊 2. Interactive EPV vs DCF Comparison...")
        self.plot_interactive_epv_dcf_enhanced()
        
        print("\n📊 3. Monte Carlo EPV Simulation...")
        self.plot_monte_carlo_simulation()
        
        print("\n✅ COMPREHENSIVE EPV ANALYSIS COMPLETE!")
        print("=" * 60)

# Main execution
if __name__ == "__main__":
    # Initialize analyzer
    analyzer = EPVAnalyzer()
    
    # Generate comprehensive report
    analyzer.generate_comprehensive_report() 