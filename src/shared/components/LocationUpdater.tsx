import { useEffect, useRef } from "react";
import { useUpdateLocationMutation, useUpdateOnlineStatusMutation } from "../../features/sos/locationApiSlice";

interface ComponentProps {
  setTargetPosition: (coords: [number, number]) => void;
  setUserPosition: (coords: [number, number]) => void;
  isFocused?: boolean;
}

// минимальное расстояние для обновления (в метрах)
const MIN_DELTA_METERS = 5;

// простая функция для расчета расстояния между двумя координатами (гаверсинус)
function getDistanceMeters([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]) {
  const R = 6371000; // радиус Земли в метрах
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function LocationUpdater({
  setTargetPosition,
  setUserPosition,
  isFocused = false,
}: ComponentProps) {
  const [updateLocation] = useUpdateLocationMutation();
  const [updateOnlineStatus] = useUpdateOnlineStatusMutation();
  const intervalRef = useRef<number | null>(null);
  const lastCoordsRef = useRef<[number, number] | null>(null);

  useEffect(() => {
    if (isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    updateOnlineStatus({ is_online: true });

    const sendLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords: [number, number] = [latitude, longitude];

        // проверка изменения координат
        const lastCoords = lastCoordsRef.current;
        if (lastCoords) {
          const distance = getDistanceMeters(lastCoords, newCoords);
          if (distance < MIN_DELTA_METERS) {
            // слишком маленькое изменение — пропускаем обновление
            return;
          }
        }

        // сохраняем новые координаты
        lastCoordsRef.current = newCoords;

        try {
          await updateLocation({ latitude, longitude }).unwrap();
          setTargetPosition(newCoords);
          setUserPosition(newCoords);
        } catch (err) {
          console.error("❌ Failed to update location", err);
        }
      });
    };

    sendLocation();
    intervalRef.current = setInterval(sendLocation, 2000);

    const handleUnload = () => updateOnlineStatus({ is_online: false });
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleUnload);
      updateOnlineStatus({ is_online: false });
    };
  }, [updateLocation, updateOnlineStatus, isFocused, setTargetPosition, setUserPosition]);

  return null;
}