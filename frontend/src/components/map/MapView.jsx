import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Create a custom green icon for the Recycler
const recyclerIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to dynamically set map view bounds based on markers
const ChangeView = ({ recyclerLoc, targetLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (recyclerLoc && targetLoc) {
      const bounds = L.latLngBounds([
        [recyclerLoc.lat, recyclerLoc.lng],
        [targetLoc.lat, targetLoc.lng]
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (recyclerLoc) {
      map.setView([recyclerLoc.lat, recyclerLoc.lng], 13);
    }
  }, [recyclerLoc, targetLoc, map]);
  return null;
};

const MapView = ({ recyclerLoc, targetLoc, routeGeometry }) => {
  if (!recyclerLoc) return <div className="h-full w-full bg-slate-100 flex items-center justify-center text-slate-500 rounded-xl border border-slate-200">Waiting for location...</div>;

  // Convert TomTom geometry to Leaflet format (array of [lat, lng])
  const polyline = routeGeometry?.points?.map(p => [p.latitude, p.longitude]) || [];

  return (
    <MapContainer 
      center={[recyclerLoc.lat, recyclerLoc.lng]} 
      zoom={13} 
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Recycler Marker */}
      <Marker position={[recyclerLoc.lat, recyclerLoc.lng]} icon={recyclerIcon}>
        <Popup>Your Location</Popup>
      </Marker>

      {/* Target E-Waste Marker */}
      {targetLoc && (
        <Marker position={[targetLoc.lat, targetLoc.lng]}>
          <Popup>Pickup Location</Popup>
        </Marker>
      )}

      {/* TomTom Route Polyline */}
      {polyline.length > 0 && (
        <Polyline pathOptions={{ color: '#0ea5e9', weight: 5, opacity: 0.8 }} positions={polyline} />
      )}

      <ChangeView recyclerLoc={recyclerLoc} targetLoc={targetLoc} />
    </MapContainer>
  );
};

export default MapView;
