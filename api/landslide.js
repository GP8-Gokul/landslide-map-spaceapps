import axios from "axios";

export default async function handler(req, res) {
  try {
    const nasaUrl =
      "https://maps.nccs.nasa.gov/mapping/rest/services/hazards/daily_landslide_hazard_poly_v2/FeatureServer/0/query?where=1%3D1&outFields=*&f=geojson";

    const response = await axios.get(nasaUrl);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(response.data);
  } catch (err) {
    console.error("NASA data fetch error:", err);
    res.status(500).json({ error: "Failed to fetch NASA data" });
  }
}
