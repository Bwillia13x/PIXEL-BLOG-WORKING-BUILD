import { WorldBankDataPoint, CountryData, YearData } from '@/types';

export async function fetchRenewableEnergyData(): Promise<WorldBankDataPoint[]> {
  const url = 'https://api.worldbank.org/v2/country/all/indicator/EG.ELC.RNEW.ZS?format=json&per_page=20000&date=1990:2025';
  const response = await fetch(url);
  const data = await response.json();
  return data[1] || [];
}

export function transformData(rawData: WorldBankDataPoint[]): {
  countryData: Map<string, CountryData>;
  yearData: Map<number, YearData>;
  availableYears: number[];
} {
  const countryData = new Map<string, CountryData>();
  const yearData = new Map<number, YearData>();
  const yearsSet = new Set<number>();

  rawData.forEach(point => {
    if (point.value === null || !point.countryiso3code) return;
    
    const year = parseInt(point.date);
    const iso3 = point.countryiso3code;
    const countryName = point.country.value;
    const value = point.value;

    if (!countryData.has(iso3)) {
      countryData.set(iso3, {
        iso3,
        name: countryName,
        data: []
      });
    }
    countryData.get(iso3)!.data.push({ year, value });

    if (!yearData.has(year)) {
      yearData.set(year, { year, countries: [] });
    }
    yearData.get(year)!.countries.push({ iso3, name: countryName, value });
    
    yearsSet.add(year);
  });

  countryData.forEach(country => {
    country.data.sort((a, b) => a.year - b.year);
  });

  yearData.forEach(year => {
    year.countries.sort((a, b) => b.value - a.value);
  });

  const availableYears = Array.from(yearsSet).sort((a, b) => a - b);

  return { countryData, yearData, availableYears };
} 