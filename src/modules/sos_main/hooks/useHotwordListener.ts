// @ts-nocheck
import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { ToastTypes } from "../../../shared/enums/ToastTypes";

/**
 * Хук слушает window.onHotword (например, из Android WebView)
 * и показывает тост при срабатывании голосового ключевого слова.
 */
export function useHotwordListener() {
  const [createSosSignal] = useCreateSosSignalMutation();

  useEffect(() => {
    window.onHotword = () => {
      try {
        async function action() {
          await createSosSignal({ latitude: lat, longitude: lon }).unwrap();
        }
        action()
        addToast({
          title: ToastTypes.ERR,
          description: "Вы произнесли ключевое слово. Сос-сигнал вызван.",
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