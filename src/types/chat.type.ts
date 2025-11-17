export interface ConversationResponse {
  id: number;
  jobId: number;
  jobTitle: string;
  applicationId: number;
  jobSeekerId: number;
  jobSeekerName: string;
  jobSeekerAvatar: string | null;
  employerId: number;
  employerName: string;
  employerAvatar: string | null;
  lastMessage: string | null;
  lastMessageSenderId: number | null;
  lastMessageSenderType: "USER" | "EMPLOYER" | null;
  hasEmployerMessage: boolean;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface MessageResponse {
  id: number;
  conversationId: number;
  senderId: number;
  senderType: "USER" | "EMPLOYER";
  senderName: string;
  senderAvatar: string | null;
  content: string;
  seen: boolean;
  createdAt: string; // ISO 8601
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}
