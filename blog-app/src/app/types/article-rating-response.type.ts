export interface ArticleRatingUpResponse {
  articleRatingUp: {
    id: string;
    title: string;
    content: string;
    rating: number;
    avgRating: number;
    votesCount: number;
    imgSrc: string;
    createdAt: string;
  };
}

export interface ArticleRatingDownResponse {
  articleRatingDown: {
    id: string;
    title: string;
    content: string;
    rating: number;
    avgRating: number;
    votesCount: number;
    imgSrc: string;
    createdAt: string;
  };
}