import { useCallback } from "react";

const LOCAL_STORAGE_KEY = "dismissed_experiences";

export function useDismissedExperiences() {
  const getDismissedExperiences = (): string[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const addDismissedExperience = useCallback((experienceKey: string): void => {
    try {
      const current = getDismissedExperiences();
      if (!current.includes(experienceKey)) {
        const updated = [...current, experienceKey];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      }
    } catch {
      // Handle errors silently
    }
  }, []);

  const experienceWasDismissed = useCallback(
    (experienceKey: string): boolean => {
      const current = getDismissedExperiences();
      return current.includes(experienceKey);
    },
    []
  );

  return {
    addDismissedExperience,
    experienceWasDismissed,
  };
}
