export default async function handler(req, res) {
  try {
    const mapServerUrl =
      "https://maps.nccs.nasa.gov/server/rest/services/global_landslide_catalog/landslide_susceptibility/MapServer/query?where=1%3D1&outFields=*&f=geojson";

    const response = await fetch(mapServerUrl);
    console.log("NASA response status:", response.status);
    if (!response.ok) {
      throw new Error(`Susceptibility API error: ${response.status}`);
    }

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (error) {
    console.error("Susceptibility fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch susceptibility data", details: error.message });
  }
}
