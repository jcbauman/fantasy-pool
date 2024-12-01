import React from "react";
import "./Slideshow.css";

const Slideshow: React.FC = () => {
  const images = [
    "https://via.placeholder.com/200x300?text=1",
    "https://via.placeholder.com/200x300?text=2",
    "https://via.placeholder.com/200x300?text=3",
    "https://via.placeholder.com/200x300?text=4",
    "https://via.placeholder.com/200x300?text=5",
  ];

  const createColumn = (direction: "up" | "down") => (
    <div className={`column scroll-${direction}`}>
      {/* Duplicate images for seamless looping */}
      {[...images, ...images].map((image, index) => (
        <img key={index} src={image} alt={`Slide ${index}`} className="image" />
      ))}
    </div>
  );

  return (
    <div className="slideshow">
      {createColumn("down")} {/* Left column */}
      {createColumn("up")} {/* Center column */}
      {createColumn("down")} {/* Right column */}
    </div>
  );
};

export default Slideshow;
