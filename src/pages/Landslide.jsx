import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const dummyLandslideData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [73.7278, 15.5334]
      },
      properties: {
        event_date: "2025-09-15T10:00:00Z",
        country_name: "India",
        location_description: "Near Ponda, Goa",
        landslide_size: "Medium",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [78.5867, 27.2312]
      },
      properties: {
        event_date: "2025-09-28T14:30:00Z",
        country_name: "India",
        location_description: "Chamoli district, Uttarakhand",
        landslide_size: "Large",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [92.9376, 26.2006]
      },
      properties: {
        event_date: "2025-10-02T05:45:00Z",
        country_name: "India",
        location_description: "Haflong, Dima Hasao, Assam",
        landslide_size: "Small",
      },
    },
  ],
};

export default function Landslide() {
  const pointToLayer = (feature, latlng) => {
    return L.circleMarker(latlng, {
      radius: 5,
      fillColor: "#0033A0",
      color: "#FFFFFF",
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9,
      pane: 'markerPane'
    });
  };

  const onEachFeature = (feature, layer) => {
    if (feature.properties) {
      const {
        event_date,
        country_name,
        location_description,
        landslide_size,
      } = feature.properties;

      const formattedDate = new Date(event_date).toLocaleDateString("en-IN", {
        year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata'
      });

      const popupContent = `
        <div class="text-sm font-sans">
          <p class="font-bold border-b pb-1 mb-1">Reported Landslide</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Country:</strong> ${country_name || "N/A"}</p>
          <p><strong>Location:</strong> ${location_description || "N/A"}</p>
          <p><strong>Size:</strong> ${landslide_size || "Unknown"}</p>
        </div>
      `;
      layer.bindPopup(popupContent);
    }
  };

  const landslideNowcastUrl = "https://maps.nccs.nasa.gov/server/rest/services/gpm_landslide_nowcast/MapServer/tile/{z}/{y}/{x}";

  return (
    <div className="relative h-screen w-full antialiased">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <TileLayer
          url={landslideNowcastUrl}
          attribution="NASA GPM Landslide Nowcast"
          opacity={0.65}
        />

        <GeoJSON
          data={dummyLandslideData}
          pointToLayer={pointToLayer}
          onEachFeature={onEachFeature}
        />
      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[1000] p-3 bg-white/90 backdrop-blur-sm shadow-xl rounded-lg border border-gray-300 w-48">
        <h4 className="mb-2 text-sm font-bold text-center text-gray-800">Landslide Hazard Legend</h4>
        <div className="flex items-center mb-1.5">
          <span className="inline-block w-4 h-4 mr-2 bg-yellow-400 opacity-80 border border-gray-700 rounded-sm"></span>
          <span className="text-xs text-gray-700 font-medium">Moderate Risk</span>
        </div>
        <div className="flex items-center mb-2">
          <span className="inline-block w-4 h-4 mr-2 bg-red-600 opacity-80 border border-gray-700 rounded-sm"></span>
          <span className="text-xs text-gray-700 font-medium">High Risk</span>
        </div>
        <div className="w-full border-t border-gray-300 my-2"></div>
        <div className="flex items-center">
          <span className="inline-block w-4 h-4 mr-2 bg-[#0033A0] border-2 border-white rounded-full box-content"></span>
          <span className="text-xs text-gray-700 font-medium">Reported Event</span>
        </div>
      </div>
    </div>
  );
}