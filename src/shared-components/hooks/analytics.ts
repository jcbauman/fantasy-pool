import { logEvent } from "firebase/analytics";
import { analytics } from "../../backend/firebase/firebaseConfig";

export const fireAnalyticsEvent = (eventName: string, params?: any) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};
