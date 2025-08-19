import { useEffect, useRef } from "react";
import { sendSuccessNotification } from "../toasts/notificationToasts";

// Custom hook to monitor loading state and log warning if it persists for too long
export const useLoadingWarning = (
  loading: boolean | undefined,
  onWarn?: () => void
) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (loading) {
      // Start timing when loading becomes true
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
        timeoutRef.current = setTimeout(() => {
          sendSuccessNotification(
            "Sorry for the wait. Check your wifi or data connection, or contact your league manager if this issue persists."
          );
          onWarn?.();
        }, 8000);
      }
    } else {
      // Clear timeout and reset timer when loading becomes false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      startTimeRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [loading, onWarn]);
};
