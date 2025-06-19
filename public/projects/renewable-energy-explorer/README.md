# Global Renewable-Energy Explorer

Interactive visualization of renewable electricity output (% of total) by country from 1990-present.

## Setup & Deploy

```bash
# Install dependencies
npm install

# Download world topology data
curl -o public/world-110m.json https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json

# Build and start
npm run build
npm start

# Deploy to Vercel
vercel --prod
```

## Features

- Choropleth world map with year slider
- Country trend charts with map hover sync
- Top/bottom 10 rankings with spark bars
- Dark mode support
- Responsive design
- ISR for yearly data updates 