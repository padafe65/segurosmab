// src/components/FlipFormCard.tsx
import React, { useState, useEffect } from "react";
import "./FlipFormCard.css";

interface FlipFormCardProps {
  frontImage: string;
  title: string;
  children: React.ReactNode;
  onClose?: () => void; // para cerrar desde el padre
  initialFlipped?: boolean;
}

export default function FlipFormCard({
  frontImage,
  title,
  children,
  onClose,
  initialFlipped = false,
}: FlipFormCardProps) {
  const [flipped, setFlipped] = useState(initialFlipped);

  useEffect(() => {
    // bloqueo scroll del body cuando la card está abierta
    document.body.style.overflow = flipped ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [flipped]);

  const handleClose = () => {
    setFlipped(false);
    // small delay to allow flip animation back before unmounting
    setTimeout(() => {
      onClose && onClose();
    }, 300);
  };

  return (
    <div className="flip-backdrop" onMouseDown={handleClose}>
      <div
        className="flip-form-wrapper"
        onMouseDown={(e) => e.stopPropagation()} /* evitar cerrar al clickear interior */
      >
        <div className="flip-form-card">
          <div className={`flip-inner ${flipped ? "flipped" : ""}`}>
            {/* FRONT */}
            <div
              className="flip-front"
              onClick={() => setFlipped(true)}
              role="button"
              aria-pressed={flipped}
            >
              <img src={frontImage} className="flip-image" alt={title} />
              <div className="flip-front-overlay">
                <h2>{title}</h2>
                <p>Haz clic para continuar</p>
              </div>
            </div>

            {/* BACK */}
            <div className="flip-back">
              <div className="flip-form-container">
                {children}

                <button
                  className="flip-back-btn"
                  onClick={handleClose}
                  type="button"
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
