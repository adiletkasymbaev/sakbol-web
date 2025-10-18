import { useEffect, useRef } from "react";
import { useUpdateLocationMutation, useUpdateOnlineStatusMutation } from "../../features/sos/locationApiSlice";

interface ComponentProps {
  setTargetPosition: (coords: [number, number]) => void;
  setUserPosition: (coords: [number, number]) => void;
  isFocused?: boolean;
}

export default function LocationUpdater({ setTargetPosition, setUserPosition, isFocused = false }: ComponentProps) {
  const [updateLocation] = useUpdateLocationMutation();
  const [updateOnlineStatus] = useUpdateOnlineStatusMutation();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // если фокус есть — не обновляем
    if (isFocused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // при входе — онлайн
    updateOnlineStatus({ is_online: true });

    // функция отправки геолокации
    const sendLocation = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          await updateLocation({ latitude, longitude }).unwrap();
          setTargetPosition([latitude, longitude]);
          setUserPosition([latitude, longitude]);
          console.log("📍 Location updated:", latitude, longitude);
        } catch (err) {
          console.error("❌ Failed to update location", err);
        }
      });
    };

    // сразу вызываем и ставим интервал
    sendLocation();
    intervalRef.current = setInterval(sendLocation, 30000);

    // при выходе — офлайн
    const handleUnload = () => updateOnlineStatus({ is_online: false });
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener("beforeunload", handleUnload);
      updateOnlineStatus({ is_online: false });
    };
  }, [updateLocation, updateOnlineStatus, isFocused, setTargetPosition]);

  return null;
}