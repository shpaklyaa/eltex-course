import { Injectable } from '@angular/core';
import { Article } from '../../types/article';

export interface BackendResponse {
  items: Article[];
  total: number;
}

export interface MappedResponse {
  articles: Article[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleMapperService {
  mapToArticles(response: BackendResponse): MappedResponse {
    return {
      articles: response.items,
      total: response.total
    };
  }
}