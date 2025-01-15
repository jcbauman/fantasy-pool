import { useEffect, useState } from "react";

const useStandaloneMode = (): boolean => {
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      return window.matchMedia("(display-mode: standalone)").matches;
    };

    setIsStandalone(checkStandalone());

    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleMediaChange = (event: MediaQueryListEvent) =>
      setIsStandalone(event.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return isStandalone;
};

export default useStandaloneMode;
