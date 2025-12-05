import { useState, useEffect } from "react";
import "../App.css"; // 👈 IMPORTA TU CSS GLOBAL

export default function Home() {
  const images = [
    "/img/seguros1.webp",
    "/img/seguros2.jpg",
    "/img/seguros3.jpg",
    "/img/seguros4.jpg",
    "/img/seguros5.jpg",
    "/img/seguros6.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="carousel-container">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${current * 100}%)`,
          }}
        >
          {images.map((img, i) => (
            <img key={i} src={img} alt={`slide-${i}`} className="carousel-image" />
          ))}
        </div>
      </div>

      <div className="hero text-center p-10">
        <h1 className="text-4xl font-bold mb-4">
          BIENVENIDO A SEGUROSMAB LA EMPRESA QUE CON CARIÑO ASEGURA TU PRESENTE Y FUTURO
        </h1>

        <p className="text-lg mb-6">
          Gestión moderna, rápida y diseñada para nuestros usuarios.
        </p>

        <a href="/registrar" className="nav-button">
          <h2>Registrarse</h2>
        </a>
      </div>
    </>
  );
}
