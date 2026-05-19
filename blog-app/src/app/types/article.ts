export interface Article {
  id: string;
  title: string;
  content: string;
  imgSrc?: string | null;
  image?: File | null;
  averageRating?: number;
  ratingCount?: number;
  categoryId?: string | null;
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
}