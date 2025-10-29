
export const PostStatus = {
  PENDING: "PENDING",
  PUBLIC: "PUBLIC",
  DRAFT: "DRAFT",
} as const;

export type PostStatus = keyof typeof PostStatus;

export const PostStatusLabelVN: Record<PostStatus, string> = {
  [PostStatus.PENDING]: "Chờ duyệt",
  [PostStatus.PUBLIC]: "Công khai",
  [PostStatus.DRAFT]: "Nháp",
};

export const PostStatusLabelEN: Record<PostStatus, string> = {
  [PostStatus.PENDING]: "Pending",
  [PostStatus.PUBLIC]: "Public",
  [PostStatus.DRAFT]: "Draft",
};

export const PostStatusColors: Record<PostStatus, string> = {
  [PostStatus.PENDING]: "bg-yellow-500 text-white",
  [PostStatus.PUBLIC]: "bg-green-500 text-white",
  [PostStatus.DRAFT]: "bg-gray-500 text-white",
};
