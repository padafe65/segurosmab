import React, { useState } from "react";
import "./FlipFormCard.css";

interface FlipFormCardProps {
  frontImage: string;
  title: string;
  children: React.ReactNode;
}

export default function FlipFormCard({
  frontImage,
  title,
  children,
}: FlipFormCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-form-wrapper">
      <div className="flip-form-card">
        <div className={`flip-inner ${flipped ? "flipped" : ""}`}>

          {/* FRONT */}
          <div className="flip-front" onClick={() => setFlipped(true)}>
            <img src={frontImage} className="flip-image" />
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
                onClick={() => setFlipped(false)}
              >
                Volver
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
