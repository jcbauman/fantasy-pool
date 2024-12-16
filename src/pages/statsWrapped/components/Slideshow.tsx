import React from "react";
import "./Slideshow.css";
import { Typography } from "@mui/material";

const Slideshow: React.FC<{ name: string }> = ({ name }) => {
  const images = [
    "/images/wrapped/vin.jpeg",
    "/images/wrapped/rock.jpeg",
    "/images/wrapped/amir.jpg",
    "/images/wrapped/zayn.jpg",
    "/images/wrapped/ri.jpg",
    "/images/wrapped/fine.jpg",
    "/images/wrapped/car.jpg",
  ];

  const createColumn = (direction: "up" | "down") => {
    const shuffledImages = images
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
    return (
      <div className={`column scroll-${direction}`}>
        {/* Duplicate images for seamless looping */}
        {[...shuffledImages, ...shuffledImages].map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Slide ${index}`}
            className="image"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="slideshow">
      {createColumn("down")} {/* Left column */}
      {createColumn("up")} {/* Center column */}
      {createColumn("down")} {/* Right column */}
      <Typography
        variant="overline"
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          zIndex: 10,
          fontSize: "4.5rem",
          textAlign: "center",
          lineHeight: "5rem",
          fontWeight: "bold",
        }}
      >
        {name}'s
        <br />
        2024
        <br />
        FANTASY POOL
        <br />
        Wrapped
      </Typography>
    </div>
  );
};

export default Slideshow;
