import { useRef } from "react";
import confetti from "canvas-confetti";

interface UseConfetti {
  confettiComponent: () => JSX.Element;
  launchConfetti: () => void;
}

export const useConfetti = (): UseConfetti => {
  const confettiRef = useRef<HTMLDivElement | null>(null);

  const launchConfetti = () => {
    if (confettiRef.current) {
      const rect = confettiRef.current.getBoundingClientRect();
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = (rect.top + rect.bottom) / 2 / window.innerHeight;

      confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        zIndex: 10000,
        origin: { x, y },
        colors: [
          "#ebb604",
          "#cc1301",
          "#0c1a7d",
          "#02694b",
          "#770504",
          "#f0e7c8",
        ],
      });
    }
  };
  const confettiComponent = (): JSX.Element => {
    return (
      <div
        ref={confettiRef}
        style={{ width: "100%", height: "100%", background: "transparent" }}
      ></div>
    );
  };
  return {
    confettiComponent,
    launchConfetti,
  };
};
