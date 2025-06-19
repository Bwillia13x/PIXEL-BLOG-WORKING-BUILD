'use client';

import { useState, useEffect } from 'react';
import type { YearData } from '@/types';

interface SparkBarRankingsProps {
  yearData: YearData[];
}

export default function SparkBarRankings({ yearData }: SparkBarRankingsProps) {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear() - 1);
  const [data, setData] = useState<YearData | null>(null);

  useEffect(() => {
    const yearInfo = yearData.find(y => y.year === selectedYear);
    setData(yearInfo || null);
  }, [selectedYear, yearData]);

  if (!data) return null;

  const top10 = data.countries.slice(0, 10);
  const bottom10 = data.countries.slice(-10).reverse();

  const SparkBar = ({ value, max }: { value: number; max: number }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4">
      <div 
        className="bg-green-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Rankings {selectedYear}</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2 text-green-600">Top 10</h3>
        <div className="space-y-2">
          {top10.map((country, i) => (
            <div key={country.iso3} className="flex items-center gap-2">
              <span className="text-sm font-medium w-6">{i + 1}</span>
              <span className="text-sm w-20 truncate">{country.name}</span>
              <div className="flex-1">
                <SparkBar value={country.value} max={100} />
              </div>
              <span className="text-sm font-medium w-12 text-right">{country.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-2 text-red-600">Bottom 10</h3>
        <div className="space-y-2">
          {bottom10.map((country, i) => (
            <div key={country.iso3} className="flex items-center gap-2">
              <span className="text-sm font-medium w-6">{data.countries.length - 9 + i}</span>
              <span className="text-sm w-20 truncate">{country.name}</span>
              <div className="flex-1">
                <SparkBar value={country.value} max={10} />
              </div>
              <span className="text-sm font-medium w-12 text-right">{country.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 