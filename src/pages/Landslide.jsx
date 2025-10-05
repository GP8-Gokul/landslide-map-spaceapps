import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Landslide() {
  const [susceptibilityData, setSusceptibilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Call your Vercel serverless function
        const res = await axios.get("/api/landslide");
        setSusceptibilityData(res.data);
      } catch (err) {
        console.error("Error fetching hazard data:", err);
        setError("Failed to fetch landslide susceptibility data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Color based on susceptibility value
  const getColor = (val) => {
    if (val >= 0.8) return "red";       // High susceptibility
    if (val >= 0.4) return "orange";    // Moderate
    return "yellow";                     // Low
  };

  const style = (feature) => ({
    color: getColor(feature.properties?.SUSCEPT || 0),
    fillOpacity: 0.5,
    weight: 1,
  });

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(
        `<b>Susceptibility:</b> ${feature.properties?.SUSCEPT || "Unknown"}`
      );
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {loading && (
        <div className="flex justify-center items-center h-full text-lg">
          Loading landslide data...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-full text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && susceptibilityData && (
        <MapContainer
          center={[20, 78]} // Centered over India
          zoom={4}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={susceptibilityData}
            style={style}
            onEachFeature={onEachFeature}
          />
        </MapContainer>
      )}
    </div>
  );
}
