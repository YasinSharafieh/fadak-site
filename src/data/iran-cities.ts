import cities from "@/data/iran-cities.json";

export type IranCity = {
  name: string;
  province: string;
  county: string;
  label: string;
};

export const iranCities = cities as IranCity[];

const byLabel = new Map<string, IranCity>();
const byName = new Map<string, IranCity[]>();

for (const city of iranCities) {
  byLabel.set(fold(city.label), city);
  const list = byName.get(fold(city.name)) || [];
  list.push(city);
  byName.set(fold(city.name), list);
}

export function fold(value: string) {
  return value
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[أإآ]/g, "ا")
    .replace(/[\u200c\u200d\u200e\u200f\ufeff]/g, "")
    .replace(/\s+/g, "")
    .trim()
    .toLowerCase();
}

export function canonicalCity(input: string) {
  const key = fold(input);
  if (!key) return null;
  const labeled = byLabel.get(key);
  if (labeled) return labeled.label;
  const named = byName.get(key);
  if (named?.length === 1) return named[0].label;
  return null;
}

export function searchCities(query: string, limit = 40) {
  const key = fold(query);
  if (!key) return iranCities.slice(0, limit);
  const starts: IranCity[] = [];
  const includes: IranCity[] = [];
  for (const city of iranCities) {
    const name = fold(city.name);
    const province = fold(city.province);
    if (name.startsWith(key)) starts.push(city);
    else if (name.includes(key) || province.includes(key) || fold(city.label).includes(key)) includes.push(city);
    if (starts.length >= limit) break;
  }
  return [...starts, ...includes].slice(0, limit);
}
