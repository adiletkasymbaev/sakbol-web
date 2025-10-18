import { Marker } from "react-leaflet";
import L from "leaflet";

interface ComponentProps {
    position: [number, number];
    avatar: string;
}

function CustomMarker({ position, avatar }: ComponentProps) {
  const icon = L.divIcon({
    className: "custom-marker",
    html: `
    <div style="position: relative; width: 81px; height: 93px;">
        <div style="position: absolute; top: -72px; left: 10%; transform: translateX(-50%); z-index: 9999; width: 63px; height: 63px; overflow: hidden; border-radius: 100%; border: 3px solid var(--color-primary); display: flex; justify-content: center; align-items: center;">
            ${avatar?.length > 0 ? '<img src="' + avatar + '" alt="Avatar" style="width: 100%;">' : '<div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; font-weight: 700; font-size: 18px;">ВЫ</div>' }
        </div>
        <img src="images/marker.png" alt="Marker" style="position: absolute; top: -80px; left: -32px; z-index: 9998;">
    </div>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

  const content = (
    <Marker position={position} icon={icon} />
  );

  return content
};

export default CustomMarker;