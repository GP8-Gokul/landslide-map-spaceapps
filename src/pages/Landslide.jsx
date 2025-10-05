import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Landslide() {
  const [hazardData, setHazardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch from your Vercel serverless function
        const res = await axios.get("/api/landslide");
        setHazardData(res.data);
      } catch (err) {
        console.error("Error fetching hazard data:", err);
        setError("Failed to fetch NASA hazard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Color based on severity
  const getColor = (level) => {
    switch (level) {
      case "HIGH":
        return "red";
      case "MODERATE":
        return "orange";
      case "LOW":
        return "yellow";
      default:
        return "gray";
    }
  };

  // Style each polygon
  const style = (feature) => ({
    color: getColor(feature.properties?.HAZ_SEV),
    weight: 1,
    fillOpacity: 0.6,
  });

  // Popup for each polygon
  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(
        `<b>Severity:</b> ${feature.properties.HAZ_SEV || "Unknown"}`
      );
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      {loading && (
        <div className="flex justify-center items-center h-full text-lg">
          Loading NASA hazard data...
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center h-full text-red-600">
          {error}
        </div>
      )}
      {!loading && !error && hazardData && (
        <MapContainer center={[20, 78]} zoom={4} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='© OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON data={hazardData} style={style} onEachFeature={onEachFeature} />
        </MapContainer>
      )}
    </div>
  );
}
