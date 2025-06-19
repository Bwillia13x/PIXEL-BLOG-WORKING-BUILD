export interface WorldBankDataPoint {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string;
  value: number | null;
  unit: string;
  obs_status: string;
  decimal: number;
}

export interface CountryData {
  iso3: string;
  name: string;
  data: { year: number; value: number }[];
}

export interface YearData {
  year: number;
  countries: { iso3: string; name: string; value: number }[];
} 