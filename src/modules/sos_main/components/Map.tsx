import { MapContainer, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import CustomMarker from "./CustomMarker";
import { selectFavoriteContacts, selectTargetLat, selectTargetLon, selectUserLat, selectUserLon } from "../../../features/sos/presenceSlice";
import { useSelector } from "react-redux";
import FlyToLocation from "./FlyToLocation";
import MapSyncTarget from "./MapSyncTarget";

function Map() {
  const favoriteContacts = useSelector(selectFavoriteContacts);
  const lat = useSelector(selectUserLat);
  const lon = useSelector(selectUserLon);
  const target_lat = useSelector(selectTargetLat);
  const target_lon = useSelector(selectTargetLon);
  const center: [number, number] = [target_lat, target_lon];

  return (
    <MapContainer center={center} zoom={15} className="h-screen w-full z-[5]">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <CustomMarker
        avatar=""
        position={[lat, lon]}
        isUser
      />

      {favoriteContacts?.map(fav => (
        <CustomMarker
          key={fav.id}
          avatar={fav?.contact?.avatar}
          position={[fav?.location?.latitude, fav?.location?.longitude]}
        />
      ))}

      <FlyToLocation/>
      <MapSyncTarget/>
    </MapContainer>
  );
}

export default Map;