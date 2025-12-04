import  {React, useState } from "react";
import "./FlipCard.css";

const FlipCard = ({ frontImage, backImage, frontText, backText }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flip-card" onClick={() => setFlipped(!flipped)}>
      <div className={`flip-card-inner ${flipped ? "flipped" : ""}`}>
        
        {/* Frente */}
        <div className="flip-card-front">
          <img src={frontImage} alt="Front" className="card-image" />
          <div className="card-overlay">
            <p>{frontText}</p>
          </div>
        </div>
        
        {/* Atrás */}
        <div className="flip-card-back">
          <img src={backImage} alt="Back" className="card-image" />
          <div className="card-overlay">
            {typeof backText === "object" ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {Object.values(backText).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{backText}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlipCard;
