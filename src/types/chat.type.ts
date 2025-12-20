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

  unreadCount?: number;
  lastMessage: string | null;
  lastMessageSenderId: number | null;
  lastMessageSenderType: "USER" | "EMPLOYER" | null;
  hasEmployerMessage: boolean;
  createdAt: string;
  updatedAt: string;
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
  createdAt: string;
}

export interface SendMessageRequest {
  conversationId: number;
  content: string;
}
