'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { CountryData } from '@/types';

interface CountryTrendChartProps {
  countryData: CountryData[];
  selectedCountry?: string;
}

export default function CountryTrendChart({ countryData, selectedCountry }: CountryTrendChartProps) {
  const [displayCountry, setDisplayCountry] = useState<CountryData | null>(null);

  useEffect(() => {
    if (selectedCountry) {
      const country = countryData.find(c => c.iso3 === selectedCountry);
      if (country) setDisplayCountry(country);
    } else if (!displayCountry && countryData.length > 0) {
      setDisplayCountry(countryData.find(c => c.iso3 === 'USA') || countryData[0]);
    }
  }, [selectedCountry, countryData, displayCountry]);

  if (!displayCountry) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">{displayCountry.name} Trend</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={displayCountry.data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="year" stroke="#666" />
          <YAxis stroke="#666" label={{ value: '% Renewable', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#2171b5" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 