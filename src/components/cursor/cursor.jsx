import { useState, useEffect } from "react";
import "./CustomCursor.css";
import cursorSvg from "../../assets/cursor2.svg?raw";

function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="custom-cursor-svg"
      style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        /* No translate(-50%, -50%) if you want the top-left corner to be the “tip.” */
        zIndex: 9999,
				width: "32px",
				height: "auto",
				filter: "drop-shadow(2px 6px 8px rgba(0, 0, 0, 0.5))",
      }}

      dangerouslySetInnerHTML={{ __html: cursorSvg }}
    />
  );
}


export default CustomCursor;
