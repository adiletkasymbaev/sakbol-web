import { useEffect } from "react";
import { addToast } from "@heroui/react";
import { ToastTypes } from "../../../shared/enums/ToastTypes";

/**
 * Хук слушает window.onHotword (например, из Android WebView)
 * и показывает тост при срабатывании голосового ключевого слова.
 */
export function useHotwordListener() {
  useEffect(() => {
    window.onHotword = () => {
      try {
        addToast({
          title: ToastTypes.OK,
          description: "Вы произнесли ключевое слово",
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