import { NASA_API_KEY } from "../config.js";

export async function getApod() {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(NASA_API_KEY)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("NASA APOD request failed.");
  return response.json();
}

export async function getNeoFeed(date = new Date().toISOString().slice(0,10)) {
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${encodeURIComponent(NASA_API_KEY)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("NASA NEO request failed.");
  const json = await response.json();
  return json.near_earth_objects?.[date] || [];
}
