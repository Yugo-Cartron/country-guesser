import countriesJson from "@/assets/countries.json";
import type {Country} from "@/model/Country";

const countries: Map<string, Country> = new Map()

export function getDataFromJson() {
  countriesJson.forEach((country) => {
    countries.set(country.name, {
      name: country.name,
      lat: country.latitude,
      long: country.longitude,
      landArea: country.landArea,
      continents: country.continents,
      population: country.population,
      flag: country.flag,
    })
  })
}

export function getCountryNames(): string[] {
  return Array.from(countries.keys())
}

export function isValid(guess: string): boolean {
  return countries.has(guess)
}

export function pickARandomAnswer(): Country {
  const countryNames = Array.from(countries.keys())
  const randomCountryIndex = Math.floor(Math.random() * countries.size)
  const randomCountryName = countryNames[randomCountryIndex]
  return countries.get(randomCountryName)!
}

export function getCountry(countryName: string): Country {
  if(isValid(countryName))
    return countries.get(countryName)!

  else
    return countries.get("France")!
}

export function getFlag(countryName: string): string {
  if(isValid(countryName))
    return countries.get(countryName)!.flag

  else
    return countries.get("France")!.flag
}