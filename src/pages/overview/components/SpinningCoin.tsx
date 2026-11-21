import { useRef, useState } from "react";
import "./SpinningCoin.css";

type SpinningCoinProps = {
  emoji?: string;
  size?: number;
};

export default function SpinningCoin({
  emoji = "🏆",
  size = 180,
}: SpinningCoinProps) {
  const rotation = useRef(0);
  const velocity = useRef(0);
  const dragging = useRef(false);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const [angle, setAngle] = useState(0);

  const updateAngle = (next: number) => {
    rotation.current = next;
    setAngle(next);
  };

  const animate = () => {
    if (dragging.current) return;

    velocity.current *= 0.985;

    if (Math.abs(velocity.current) < 0.05) {
      velocity.current = 0;
      return;
    }

    rotation.current += velocity.current;
    setAngle(rotation.current);

    animationFrame.current = requestAnimationFrame(animate);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    lastTime.current = performance.now();
    velocity.current = 0;

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
    }

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;

    const now = performance.now();
    const deltaX = e.clientX - lastX.current;
    const deltaTime = Math.max(now - lastTime.current, 1);

    const movement = deltaX * 0.8;

    rotation.current += movement;
    velocity.current = (movement / deltaTime) * 16;

    setAngle(rotation.current);

    lastX.current = e.clientX;
    lastTime.current = now;
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;

    dragging.current = false;
    animationFrame.current = requestAnimationFrame(animate);
  };

  const normalizedAngle = ((angle % 360) + 360) % 360;
  const showFront = normalizedAngle < 90 || normalizedAngle > 270;

  return (
    <div
      className="coin-stage"
      style={{
        width: size,
        height: size,
        perspective: size * 4,
        touchAction: "none",
        cursor: dragging.current ? "grabbing" : "grab",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div
        className="coin"
        style={{
          transform: `rotateY(${angle}deg)`,
        }}
      >
        <div className="coin-edge" />

        <div className="coin-face coin-front">
          <div className="coin-inner">
            <span className="coin-emoji">{emoji}</span>
          </div>
        </div>

        <div className="coin-face coin-back">
          <div className="coin-inner">
            <span className="coin-emoji">{emoji}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
