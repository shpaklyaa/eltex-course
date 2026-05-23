export interface CommentRatingUpResponse {
  commentRatingUp: {
    id: string;
    articleId: string;
    username: string;
    content: string;
    rating: number;
    votesCount: number;
    avgRating: number;
    createdAt: string;
  };
}

export interface CommentRatingDownResponse {
  commentRatingDown: {
    id: string;
    articleId: string;
    username: string;
    content: string;
    rating: number;
    votesCount: number;
    avgRating: number;
    createdAt: string;
  };
}