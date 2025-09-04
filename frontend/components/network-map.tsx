"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";

// Fix for default marker icon issue with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

interface NetworkMapProps {
  nodes: { id: string; deviceName: string; deviceType: string; lat: number; lng: number; status: 'online' | 'offline' | 'warning' }[];
}

const NetworkMap: React.FC<NetworkMapProps> = ({ nodes }) => {
  const defaultCenter: [number, number] = [-1.286389, 36.817223]; // Nairobi coordinates

  const getMarkerColor = (status: 'online' | 'offline' | 'warning') => {
    switch (status) {
      case 'online':
        return 'green';
      case 'offline':
        return 'red';
      case 'warning':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const createCustomIcon = (status: 'online' | 'offline' | 'warning') => {
    const color = getMarkerColor(status);
    return new L.DivIcon({
      className: 'custom-div-icon',
      html: `<div style="background-color:${color}; width:24px; height:24px; border-radius:50%; border: 2px solid white;"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
      popupAnchor: [0, -12],
    });
  };

  return (
    <MapContainer center={defaultCenter} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {nodes.map((node) => (
        <Marker key={node.id} position={[node.lat, node.lng]} icon={createCustomIcon(node.status)}>
          <Popup>
            <div>
              <strong>{node.deviceName}</strong> ({node.deviceType})
              <br />
              Status: {node.status}
              <br />
              <Link href={`/dashboard/operations/network-devices/${node.id}`}>
                View Details
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default NetworkMap;
