import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapClickHandler({ onChange }) {
  useMapEvents({
    click(e) {
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapUpdater({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom() < 10 ? 12 : map.getZoom());
  }, [lat, lng, map]);
  return null;
}

const LocationMapPicker = ({ lat, lng, locationName, onChange }) => {
  const [searchQuery, setSearchQuery] = useState(locationName);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef();
  const wrapperRef = useRef(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const searchLocation = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=pk`
      );
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(data.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setSearching(false);
    }
  };

  const handleInputChange = (value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchLocation(value), 400);
  };

  const selectSuggestion = (item) => {
    const newLat = parseFloat(item.lat);
    const newLng = parseFloat(item.lon);
    onChange(newLat, newLng, item.display_name);
    setSearchQuery(item.display_name);
    setShowSuggestions(false);
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await res.json();
      const name =
        data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      onChange(latitude, longitude, name);
      setSearchQuery(name);
    } catch {
      onChange(latitude, longitude, `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
    }
  };

  const handleMapClick = (latitude, longitude) => {
    reverseGeocode(latitude, longitude);
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => reverseGeocode(pos.coords.latitude, pos.coords.longitude),
        () => console.error("Geolocation denied")
      );
    }
  };

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <div className="relative" ref={wrapperRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Search for a city, address, or place..."
            className="pl-9 pr-20 bg-background/50 border-border/50"
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
            {searching && (
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
            )}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleGetCurrentLocation}
              className="h-7 px-2"
              title="Use my current location"
            >
              <Navigation className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-[9999] w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
            {suggestions.map((item, i) => (
              <button
                key={i}
                onClick={() => selectSuggestion(item)}
                className="w-full text-left px-3 py-2.5 text-sm hover:bg-accent/50 transition-colors border-b border-border/30 last:border-0 flex items-start gap-2"
              >
                <Search className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                <span className="line-clamp-2">{item.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        className="rounded-xl overflow-hidden border border-border/50 shadow-md"
        style={{ height: "240px" }}
      >
        <MapContainer
          center={[30.3753, 69.3451]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          maxBounds={[
            [23.5, 60.5],
            [37.5, 77.5],
          ]}
          minZoom={5}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]} />
          <MapClickHandler onChange={handleMapClick} />
          <MapUpdater lat={lat} lng={lng} />
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationMapPicker;