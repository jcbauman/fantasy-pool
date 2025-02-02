import { logEvent } from "firebase/analytics";
import { analytics } from "../../backend/firebase/firebaseConfig";

export const fireAnalyticsEvent = (eventName: string, params?: any) => {
  if (window.location.hostname === "localhost") {
    console.log(`[Analytics Debug] Event: ${eventName}`, params); //log instead of sending event on localhost
    return;
  }
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};
