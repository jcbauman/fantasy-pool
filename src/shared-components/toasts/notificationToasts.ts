// notificationUtils.ts
import { sendNotification } from "./NotificationProvider";

export const sendSuccessNotification = (message: string) => {
  sendNotification(message, "success");
};

export const sendErrorNotification = (message: string) => {
  sendNotification(message, "error");
};
