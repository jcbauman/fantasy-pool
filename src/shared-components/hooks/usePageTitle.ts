import { useEffect } from "react";

export const usePageTitle = (title: string) => {
  useEffect(() => {
    if (title === "Fantasy Pool Home") {
      document.title = title;
    } else {
      document.title = `${title} | Fantasy Pool`;
    }
  }, [title]);
};
