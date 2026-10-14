import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { EmergencyRequest } from '../types';
import { MapPin, AlertCircle } from 'lucide-react';

interface EmergencyMapProps {
  requests: EmergencyRequest[];
  onSelectRequest?: (req: EmergencyRequest) => void;
}

export const EmergencyMap: React.FC<EmergencyMapProps> = ({ requests, onSelectRequest }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [mapError, setMapError] = useState<boolean>(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      if (!mapInstanceRef.current) {
        // Initialize map centered roughly around India
        const map = L.map(mapContainerRef.current, {
          center: [13.0827, 80.2707], // Chennai center default
          zoom: 7,
          scrollWheelZoom: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;
      }
    } catch (err) {
      console.warn('Map initialization note:', err);
      setMapError(true);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when requests change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    const validCoords: [number, number][] = [];

    requests.forEach((req) => {
      // Use coordinates if available, or approximate based on area
      let lat = req.latitude;
      let lng = req.longitude;

      if (!lat || !lng) {
        // Safe approximate coordinates for recognized sample areas if not geocoded
        if (req.area.toLowerCase().includes('velachery')) {
          lat = 12.9815;
          lng = 80.2180;
        } else if (req.area.toLowerCase().includes('saidapet')) {
          lat = 13.0213;
          lng = 80.2231;
        } else if (req.area.toLowerCase().includes('rohini') || req.area.toLowerCase().includes('delhi')) {
          lat = 28.7158;
          lng = 77.1147;
        } else if (req.area.toLowerCase().includes('nagapattinam')) {
          lat = 10.7656;
          lng = 79.8424;
        } else {
          return; // Skip markers without coordinates
        }
      }

      validCoords.push([lat, lng]);

      // Status marker color: Amber for Pending, Blue for In Progress, Green for Completed
      let colorClass = '#F59E0B'; // Pending
      if (req.status === 'In Progress') colorClass = '#2563EB';
      if (req.status === 'Completed') colorClass = '#10B981';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: ${colorClass}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: bold;">
            !
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([lat, lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; font-size: 12px; min-width: 180px; line-height: 1.4;">
          <div style="font-weight: bold; color: #102B55; font-size: 13px;">${req.id}</div>
          <div style="color: #E73343; font-weight: 600;">${req.emergency_type}</div>
          <div style="color: #475569; margin-top: 4px;">${req.area}</div>
          <div style="margin-top: 4px; font-size: 11px;">
            <strong>People affected:</strong> ${req.people_count}
          </div>
          <div style="margin-top: 2px; font-size: 11px;">
            <strong>Status:</strong> <span style="font-weight: 600;">${req.status}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      if (onSelectRequest) {
        marker.on('click', () => onSelectRequest(req));
      }

      markersLayerRef.current?.addLayer(marker);
    });

    if (validCoords.length > 0 && mapInstanceRef.current) {
      try {
        const bounds = L.latLngBounds(validCoords);
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
      } catch (e) {
        // Safe catch
      }
    }
  }, [requests, onSelectRequest]);

  if (mapError) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 space-y-2">
        <AlertCircle className="w-8 h-8 mx-auto text-slate-400" />
        <p className="text-sm font-semibold">Map unavailable in offline mode</p>
        <p className="text-xs">Location records are securely displayed in the data table below.</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[360px] rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-1000 bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg shadow-md border border-slate-200 text-[11px] flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span className="text-slate-700">Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
          <span className="text-slate-700">In Progress</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span className="text-slate-700">Completed</span>
        </div>
      </div>
    </div>
  );
};
