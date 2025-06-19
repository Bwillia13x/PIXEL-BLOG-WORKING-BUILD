import { fetchRenewableEnergyData, transformData } from '@/lib/fetchWorldBankData';
import WorldMap from '@/components/WorldMap';
import CountryTrendChart from '@/components/CountryTrendChart';
import SparkBarRankings from '@/components/SparkBarRankings';
import YearSlider from '@/components/YearSlider';
import DarkModeToggle from '@/components/DarkModeToggle';

export const revalidate = 31536000;

export default async function Home() {
  const rawData = await fetchRenewableEnergyData();
  const { countryData, yearData, availableYears } = transformData(rawData);
  
  const countryDataArray = Array.from(countryData.values());
  const yearDataArray = Array.from(yearData.values());

  return (
    <main className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Global Renewable-Energy Explorer</h1>
          <DarkModeToggle />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WorldMap 
              yearData={yearDataArray} 
              countryData={countryDataArray}
              availableYears={availableYears}
            />
            <YearSlider availableYears={availableYears} />
          </div>
          
          <div className="space-y-6">
            <CountryTrendChart countryData={countryDataArray} />
            <SparkBarRankings yearData={yearDataArray} />
          </div>
        </div>
      </div>
    </main>
  );
} 