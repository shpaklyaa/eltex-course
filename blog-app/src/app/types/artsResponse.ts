export interface ArtsResponse<T> {
    articles: T[]; 
    total: number;
    page?: number;
    limit?: number;
}