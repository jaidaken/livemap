import { useState, useEffect } from "react";
import "./CustomCursor.css";

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
    <svg
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        pointerEvents: "none",
        zIndex: 9999,
        width: "18px",
        height: "auto",
				filter: "drop-shadow(2px 6px 8px rgba(0, 0, 0, 0.5))",
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 201 256"
    >
      <g fill="#00a8f2">
        <path d="M48.51,247.313l-48.291,-234.496c-0.926,-4.495 1.129,-9.079 5.1,-11.38c3.971,-2.301 8.97,-1.803 12.409,1.236l179.536,158.632c3.703,3.271 4.674,8.657 2.348,13.015c-2.326,4.359 -7.341,6.549 -12.119,5.294l-93.728,-24.617l-24.495,92.885c-1.263,4.788 -5.656,8.077 -10.606,7.942c-4.95,-0.136 -9.156,-3.661 -10.154,-8.511Zm10.446,-2.151l27.213,-103.188l104.033,27.324l-179.536,-158.632l48.29,234.496Z" />
        <path d="M58.956,245.162l-48.29,-234.496l179.536,158.632l-104.033,-27.324l-27.213,103.188Z" />
        <path d="M57.737,251.491l-50.794,-247.154l188.844,167.195l-109.427,-28.799l-28.623,108.758Z" />
      </g>
    </svg>
  );
}

export default CustomCursor;
