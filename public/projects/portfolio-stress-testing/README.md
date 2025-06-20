# Portfolio Stress Testing Dashboard

## Overview

The Portfolio Stress Testing Dashboard is an advanced risk analysis tool designed specifically for value investors. It simulates how your portfolio would perform during major historical market crises, providing critical insights for risk management and position sizing decisions.

## 🎯 Key Features

### Crisis Scenario Testing
- **2008 Financial Crisis**: 57% market decline over 18 months
- **COVID-19 Crash (2020)**: Rapid 34% decline in 33 days
- **Dot-com Bubble (2000-2002)**: 49% market decline over 2.5 years
- **1970s Stagflation**: High inflation with economic stagnation
- **Custom Scenarios**: Define your own stress test parameters

### Advanced Analytics
- **Maximum Drawdown Analysis**: Peak-to-trough portfolio decline
- **Recovery Time Estimation**: Time to reach previous portfolio highs
- **Value at Risk (VaR)**: Potential losses at 95% confidence level
- **Beta-Adjusted Risk**: Portfolio volatility relative to market
- **Stress-Adjusted Sharpe Ratio**: Risk-adjusted performance metrics

### Interactive Visualizations
- **Performance Timeline**: Portfolio vs market performance during crisis
- **Monte Carlo Simulation**: 1,000+ scenario probability distribution
- **Real-time Calculations**: Sub-3 second analysis completion
- **Export Capabilities**: JSON data export for further analysis

## 🧮 Methodology

### Stress Test Calculation
```
Portfolio Drawdown = Market Decline × Portfolio Beta
Final Value = Current Value × (1 + Portfolio Drawdown)
Recovery Time = Crisis Duration × 0.6 (historical average)
```

### Beta Estimation
- **Technology Stocks**: 1.1 - 1.5 (higher volatility)
- **Defensive Stocks**: 0.4 - 0.7 (lower volatility)
- **Financial Stocks**: 1.2 - 1.7 (market sensitive)
- **General Stocks**: 0.8 - 1.4 (market average)

### Monte Carlo Simulation
- Runs 1,000 iterations with ±30% volatility around base scenario
- Generates probability distribution of potential outcomes
- Provides confidence intervals for risk assessment

## 📊 Sample Portfolio

The dashboard includes a pre-loaded value investing portfolio:

| Ticker | Company | Shares | Value | Beta | Allocation |
|--------|---------|--------|-------|------|------------|
| BRK.B  | Berkshire Hathaway | 100 | $29,500 | 0.85 | 25.0% |
| JNJ    | Johnson & Johnson | 150 | $24,750 | 0.65 | 21.0% |
| PG     | Procter & Gamble | 120 | $18,600 | 0.55 | 15.8% |
| MSFT   | Microsoft | 40 | $13,400 | 1.15 | 11.4% |
| WMT    | Walmart | 80 | $12,160 | 0.45 | 10.3% |
| KO     | Coca-Cola | 200 | $11,600 | 0.75 | 9.8% |
| AAPL   | Apple | 50 | $9,250 | 1.25 | 7.9% |

**Portfolio Beta**: 0.78 (22% less volatile than market)

## 🔍 Historical Crisis Analysis

### 2008 Financial Crisis Results
- **Portfolio Drawdown**: -44.5% (vs -57% market)
- **Recovery Time**: 22 months
- **VaR (95%)**: $6,250 potential loss
- **Key Insight**: Defensive positioning reduced drawdown by 12.5%

### COVID-19 Crash Results
- **Portfolio Drawdown**: -26.5% (vs -34% market)
- **Recovery Time**: 1.3 months
- **VaR (95%)**: $9,450 potential loss
- **Key Insight**: Quality stocks recovered faster than market

## 🎛️ Usage Instructions

### 1. Portfolio Input
- Enter stock ticker symbols (e.g., AAPL, MSFT)
- Specify number of shares owned
- Input purchase price per share
- Click "+" to add to portfolio

### 2. Scenario Selection
- Choose from 5 historical crisis scenarios
- Review scenario descriptions and market impacts
- Selected scenario highlighted in purple

### 3. Stress Test Execution
- Switch to "Stress Test" tab
- Analysis runs automatically with loading animation
- Results display in 3 seconds with comprehensive metrics

### 4. Results Interpretation
- **Green metrics**: Positive or neutral outcomes
- **Red metrics**: Risk factors requiring attention
- **Charts**: Visual representation of portfolio performance

## 📈 Integration with Value Investing Platform

The Portfolio Stress Testing Dashboard integrates seamlessly with our other tools:

- **Quality Score Engine**: Use quality scores to assess defensive characteristics
- **Margin of Safety Calculator**: Stress test different valuation scenarios
- **Deep Value Screener**: Identify stocks that performed well in past crises

## 🔬 Technical Implementation

### Frontend Architecture
- **Pure HTML/CSS/JavaScript**: No external dependencies except Chart.js
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Calculations**: Client-side processing for instant results
- **Chart.js Integration**: Professional financial visualizations

### Performance Optimization
- **Efficient Algorithms**: O(n) complexity for portfolio calculations
- **Lazy Loading**: Charts created only when needed
- **Memory Management**: Proper cleanup of chart instances
- **Mobile Responsive**: Optimized for all screen sizes

## 🎯 Value Investing Applications

### Risk Management
- **Position Sizing**: Determine appropriate allocation based on stress test results
- **Diversification**: Identify concentration risks in portfolio
- **Defensive Positioning**: Assess need for more defensive stocks

### Crisis Preparation
- **Scenario Planning**: Understand potential portfolio impacts
- **Cash Allocation**: Determine appropriate cash reserves
- **Rebalancing Strategy**: Plan for crisis opportunities

### Performance Evaluation
- **Risk-Adjusted Returns**: Compare performance on risk-adjusted basis
- **Benchmark Comparison**: Evaluate against market performance
- **Historical Context**: Understand portfolio behavior in different environments

## 🔮 Future Enhancements

### Planned Features
- **Sector Analysis**: Stress test by industry sector
- **International Crises**: Add emerging market crisis scenarios
- **Real-time Data**: Integration with financial APIs
- **Advanced Metrics**: Conditional VaR, Expected Shortfall

### API Integration Roadmap
- **Alpha Vantage**: Real-time stock prices and beta calculations
- **FRED Economic Data**: Macro-economic stress scenarios
- **Portfolio Analytics**: Advanced risk metrics and correlations

## 📚 Educational Resources

### Recommended Reading
- "The Intelligent Investor" by Benjamin Graham
- "Margin of Safety" by Seth Klarman
- "The Little Book of Value Investing" by Christopher Browne

### Academic Research
- Fama-French risk factor models
- Behavioral finance in crisis periods
- Value investing performance during market stress

## ⚠️ Disclaimer

This tool is for educational and analytical purposes only. Past performance does not guarantee future results. All investment decisions should be made based on thorough research and consideration of individual financial circumstances.

---

**Built with**: HTML5, CSS3, JavaScript, Chart.js  
**Compatible with**: Chrome, Firefox, Safari, Edge  
**Mobile Support**: iOS, Android responsive design  
**Last Updated**: June 2025 