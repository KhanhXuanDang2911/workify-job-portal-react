export enum NotificationType {
  NEW_APPLICATION = "NEW_APPLICATION",
  APPLICATION_STATUS_UPDATE = "APPLICATION_STATUS_UPDATE",
}

export interface NotificationResponse {
  id: number;
  title: string;
  content: string;
  type: NotificationType;
  link: string | null;
  jobId: number | null;
  applicationId: number | null;
  readFlag: boolean;
  createdAt: string;
}
