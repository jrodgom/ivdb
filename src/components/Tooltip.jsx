import { useState } from "react";

export default function Tooltip({ children, text, position = "top" }) {
  const [visible, setVisible] = useState(false);

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className={`absolute ${positionClasses[position]} z-60 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in duration-200`}
        >
          {text}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 rotate-45 ${
              position === "top"
                ? "-bottom-1 left-1/2 -translate-x-1/2 border-r border-b"
                : position === "bottom"
                ? "-top-1 left-1/2 -translate-x-1/2 border-l border-t"
                : position === "left"
                ? "-right-1 top-1/2 -translate-y-1/2 border-r border-t"
                : "-left-1 top-1/2 -translate-y-1/2 border-l border-b"
            }`}
          />
        </div>
      )}
    </div>
  );
}
