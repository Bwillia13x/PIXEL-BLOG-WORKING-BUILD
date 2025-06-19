'use client';

import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

interface YearSliderProps {
  availableYears: number[];
  onYearChange?: (year: number) => void;
}

export default function YearSlider({ availableYears, onYearChange }: YearSliderProps) {
  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1]);

  const debouncedChange = useCallback(
    debounce((year: number) => {
      if (onYearChange) onYearChange(year);
    }, 150),
    [onYearChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    debouncedChange(year);
  };

  return (
    <div className="mt-4 px-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">Year: {selectedYear}</span>
        <span className="text-sm text-gray-500">{availableYears[0]} - {availableYears[availableYears.length - 1]}</span>
      </div>
      <input
        type="range"
        min={availableYears[0]}
        max={availableYears[availableYears.length - 1]}
        value={selectedYear}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </div>
  );
} 