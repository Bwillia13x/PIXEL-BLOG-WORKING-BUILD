'use client';

import { useEffect, useRef, useState } from 'react';
import { geoPath, geoNaturalEarth1 } from 'd3-geo';
import { feature } from 'topojson-client';
import { getColorScale, formatValue } from '@/lib/dataTransformations';
import type { CountryData, YearData } from '@/types';

interface WorldMapProps {
  yearData: YearData[];
  countryData: CountryData[];
  availableYears: number[];
}

export default function WorldMap({ yearData, countryData, availableYears }: WorldMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedYear, setSelectedYear] = useState(availableYears[availableYears.length - 1]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [topology, setTopology] = useState<any>(null);

  useEffect(() => {
    fetch('/world-110m.json')
      .then(res => res.json())
      .then(data => setTopology(data));
  }, []);

  useEffect(() => {
    if (!topology || !svgRef.current) return;

    const width = 800;
    const height = 400;
    const projection = geoNaturalEarth1().fitSize([width, height], { type: 'Sphere' });
    const pathGenerator = geoPath().projection(projection);
    
    const yearDataMap = new Map(yearData.find(d => d.year === selectedYear)?.countries.map(c => [c.iso3, c.value]) || []);
    const colorScale = getColorScale([0, 100]);

    const svg = svgRef.current;
    svg.innerHTML = '';
    
    const countries = feature(topology, topology.objects.countries);
    
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    countries.features.forEach((feature: any) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const iso3 = feature.properties.ISO_A3;
      const value = yearDataMap.get(iso3);
      
      path.setAttribute('d', pathGenerator(feature) || '');
      path.setAttribute('fill', value ? colorScale(value) : '#ccc');
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', '0.5');
      path.style.cursor = 'pointer';
      
      path.addEventListener('mouseenter', () => {
        setHoveredCountry(iso3);
        path.setAttribute('stroke', '#000');
        path.setAttribute('stroke-width', '2');
      });
      
      path.addEventListener('mouseleave', () => {
        setHoveredCountry(null);
        path.setAttribute('stroke', '#fff');
        path.setAttribute('stroke-width', '0.5');
      });
      
      if (value) {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${feature.properties.NAME}: ${formatValue(value)}`;
        path.appendChild(title);
      }
      
      g.appendChild(path);
    });
    
    svg.appendChild(g);
  }, [topology, selectedYear, yearData]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h2 className="text-xl font-semibold mb-4">Renewable Electricity Output by Country</h2>
      <svg 
        ref={svgRef} 
        viewBox="0 0 800 400" 
        className="w-full h-auto"
      />
    </div>
  );
} 