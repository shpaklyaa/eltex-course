export interface Article {
  id: string;
  title: string;
  content: string;
  averageRating?: number;
  ratingCount?: number;
}