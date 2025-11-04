// @ts-nocheck
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { ToastTypes } from "../../../shared/enums/ToastTypes";
import { useCreateSosSignalMutation } from "../../../features/sos/sosApiSlice";
import { useSelector } from "react-redux";
import { selectUserLat, selectUserLon } from "../../../features/sos/presenceSlice";

/**
 * Хук слушает window.onHotword (например, из Android WebView)
 * и показывает тост при срабатывании голосового ключевого слова.
 */
export function useHotwordListener() {
  const [createSosSignal] = useCreateSosSignalMutation();
  const lat = useSelector(selectUserLat);
  const lon = useSelector(selectUserLon);

  useEffect(() => {
    window.onHotword = () => {
      try {
        async function action() {
          await createSosSignal({ latitude: lat, longitude: lon, type: "emergency" }).unwrap();
        }
        action()
        addToast({
          title: ToastTypes.ERR,
          description: "Вы произнесли ключевое слово. Экстренный СОС-сигнал вызван.",
          color: "success",
        });
      } catch (e) {
        console.error("Ошибка при отображении тоста:", e);
      }
    };

    return () => {
      delete window.onHotword;
    };
  }, []);
}