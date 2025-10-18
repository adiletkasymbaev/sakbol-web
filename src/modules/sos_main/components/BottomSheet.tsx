import { Button } from "@heroui/react";
import React, { useState, useRef, useEffect } from "react";
import IconMapPin from "../../../shared/icons/IconMapPin";

interface ComponentProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export default function BottomSheet({ children, onClick = () => {} }: ComponentProps) {
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const updateHeight = () => {
      if (contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };

    // Обновляем сразу
    updateHeight();

    // Создаём ResizeObserver, чтобы следить за изменением размера children
    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [children]); // можно добавить children, чтобы обновлять при смене

  return (
    <div className="fixed inset-x-0 bottom-12 z-[9998]">
      {/* Кнопка управления */}
      <div className="flex justify-center">
        <div className="bg-white w-full h-3 relative">
          <Button 
            onClick={onClick}
            isIconOnly 
            className="size-14 bg-primary rounded-full shadow-2xl absolute -top-16 left-2"
          >
            <IconMapPin className="text-secondary"/>
          </Button>
          
          <img
            className={`absolute right-6 -top-2 cursor-pointer transition-transform duration-300 ${
              open ? 'scale-y-[-1]' : 'scale-y-100'
            }`}
            src="images/toggler.png"
            alt="toggler image"
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
      </div>

      {/* Меню */}
      <div
        style={{
          height: open ? height : 0,
        }}
        className="transition-all duration-300 bg-white shadow-xl overflow-hidden"
      >
        <div ref={contentRef} className="p-3 pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}