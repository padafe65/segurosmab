import { useState } from "react";

interface CarouselProps {
  images: string[];
}

const Carousel3D: React.FC<CarouselProps> = ({ images }) => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () => setCurrent((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="relative w-full h-[420px] flex justify-center items-center overflow-hidden bg-gray-50">
      
      {/* Contenedor 3D */}
      <div
        className="w-[70%] h-[350px] relative transition-all duration-700"
        style={{
          transform: `translateZ(-200px) rotateY(${current * -60}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {images.map((img, index) => (
          <div
            key={index}
            className="absolute w-full h-full rounded-xl overflow-hidden shadow-lg border"
            style={{
              transform: `rotateY(${index * 60}deg) translateZ(300px)`,
            }}
          >
            <img
              src={img}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={prev}
        className="absolute left-4 bg-white/70 px-4 py-2 rounded-full shadow hover:bg-white"
      >
        ◀
      </button>

      <button
        onClick={next}
        className="absolute right-4 bg-white/70 px-4 py-2 rounded-full shadow hover:bg-white"
      >
        ▶
      </button>
    </div>
  );
};

export default Carousel3D;
