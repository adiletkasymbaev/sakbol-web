// @ts-nocheck
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import { useEffect } from "react";
import CustomMarker from "./CustomMarker";
import { useGetFavoritesQuery } from "../../../features/contacts/favoritesApi";

function FlyToLocation({ position }: { position: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 1.5 });
    }
  }, [position, map]);

  return null;
}

// Компонент для синхронизации зума
function ZoomController({ zoom, setZoom }: { zoom: number; setZoom: (z: number) => void }) {
  const map = useMap();

  useEffect(() => {
    if (map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }

    const handleZoom = () => {
      setZoom(map.getZoom());
    };

    map.on("zoomend", handleZoom);

    return () => {
      map.off("zoomend", handleZoom);
    };
  }, [zoom, setZoom, map]);

  return null;
}

interface ComponentProps {
  targetPosition: [number, number];
  userPosition: [number, number];
  zoom: number;
  setZoom: (z: number) => void;
}

function Map({ targetPosition, zoom, setZoom, userPosition }: ComponentProps) {
  const { data: favoriteContacts, isLoading } = useGetFavoritesQuery();

  return (
    <MapContainer center={targetPosition} zoom={zoom} zoomControl={false} className="h-screen w-full z-[5]">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <CustomMarker
        avatar=""
        position={userPosition}
      />

      {favoriteContacts?.results?.map(fav => (
        <CustomMarker
          key={fav.id}
          avatar={fav?.contact?.avatar}
          position={[fav?.location?.latitude, fav?.location?.longitude]}
        />
      ))}

      <FlyToLocation position={targetPosition} />
      <ZoomController zoom={zoom} setZoom={setZoom} />
    </MapContainer>
  );
}

export default Map;