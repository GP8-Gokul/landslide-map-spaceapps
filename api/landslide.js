export default async function handler(req, res) {
  try {
    const nasaUrl =
      "https://maps.nccs.nasa.gov/mapping/rest/services/hazards/daily_landslide_hazard_poly_v2/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson";

    // Use fetch instead of axios (Vercel handles fetch natively)
    const response = await fetch(nasaUrl);

    if (!response.ok) {
      throw new Error(`NASA API error: ${response.status}`);
    }

    const data = await response.json();

    // Add CORS header for safety
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("NASA data fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch NASA data", details: error.message });
  }
}
