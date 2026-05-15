export interface Article {
  id: string;
  title: string;
  content: string;
  averageRating?: number;
  ratingCount?: number;
  imgSrc?: string | null;
  categoryId?: string | null;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}