import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, Observable, of, map, switchMap } from 'rxjs';
import { Coment } from '../../types/coment';
import { Article } from '../../types/article';
import { GET_COMMENTS } from '../gql/get-comments.gql';
import { CommentsByArticle } from '../../types/comments-gql-response.type'
import { ADD_COMMENT } from '../gql/add-comment.gql';
import { AddComment } from '../../types/add-comment-gql-response.type';
import { COMMENT_RATING_UP } from '../gql/comment-rating-up.gql';
import { COMMENT_RATING_DOWN } from '../gql/comment-rating-down.gql';
import { ARTICLE_RATING_UP } from '../gql/article-rating-up.gql';
import { ARTICLE_RATING_DOWN } from '../gql/article-rating-down.gql';
import { ArticleRatingUpResponse, ArticleRatingDownResponse} from '../../types/article-rating-response.type';
import { CommentRatingUpResponse, CommentRatingDownResponse} from '../../types/comment-rating-response.type';

@Injectable()
export class GqlService {
    private apollo = inject(Apollo);

    getCommentsForArticle(articleId: string): Observable<Coment[]> {
        return this.apollo.query<CommentsByArticle>({
            query: GET_COMMENTS,
            variables: { articleId },
            fetchPolicy: 'no-cache'
        }).pipe(
            map((result: Apollo.QueryResult<CommentsByArticle>) => result.data?.commentsByArticle ?? []),
            catchError((e) => {
                console.error(e);
                return of([]);
            })
        );
    }

    create(commentData: Omit<Coment, 'id'>): Observable<Coment> {
        return this.apollo.mutate<AddComment>({
            mutation: ADD_COMMENT,
            variables: {
                createComment: {
                    articleId: commentData.articleId,
                    username: commentData.username || 'Аноним',
                    content: commentData.content || '',
                }
            },
        }).pipe(
            map((result: Apollo.MutateResult<AddComment>) => {
                if (!result.data?.createComment) {
                    throw new Error('createComment not returned in data');
                }
                     
               return result.data.createComment}),
            catchError(err => {
                console.error('Create comment failed', err);
                throw err;
            })
        );
    }

    updateCommentRatingUp(commentId: string): Observable<Coment> {
        return this.apollo.mutate<CommentRatingUpResponse>({
            mutation: COMMENT_RATING_UP,
            variables: { id: commentId }
        }).pipe(
            map(result => {
            const r = result.data?.commentRatingUp;
            if (!r) throw new Error('commentRatingUp not returned');
            return {
                id: r.id,
                articleId: r.articleId,
                username: r.username,
                content: r.content,
                rating: r.rating,
            } as Coment;
            }),
            catchError(err => {
            console.error('Up failed', err);
            throw err;
            })
        );
    }

    updateCommentRatingDown(commentId: string): Observable<Coment> {
        return this.apollo.mutate<CommentRatingDownResponse>({
            mutation: COMMENT_RATING_DOWN,
            variables: { id: commentId }
        }).pipe(
            map(result => {
            const r = result.data?.commentRatingDown;
            if (!r) throw new Error('commentRatingDown not returned');
            return {
                id: r.id,
                articleId: r.articleId,
                username: r.username,
                content: r.content,
                rating: r.rating,
            } as Coment;
            }),
            catchError(err => {
            console.error('Down failed', err);
            throw err;
            })
        );
    }

    updateArticleRatingUp(articleId: string): Observable<Article> {
        return this.apollo.mutate<ArticleRatingUpResponse>({
            mutation: ARTICLE_RATING_UP,
            variables: { id: articleId }
        }).pipe(
            map(result => {
            const r = result.data?.articleRatingUp;
            if (!r) throw new Error('articleRatingUp not returned');
            return {
                id: r.id,
                title: r.title,
                content: r.content,
                rating: r.rating,
                avgRating: r.avgRating,
                votesCount: r.votesCount,
                imgSrc: r.imgSrc,
                createdAt: r.createdAt,
            } as Article;
            }),
            catchError(err => {
            console.error('Article rating up failed', err);
            throw err;
            })
        );
    }

    updateArticleRatingDown(articleId: string): Observable<Article> {
        return this.apollo.mutate<ArticleRatingDownResponse>({
            mutation: ARTICLE_RATING_DOWN,
            variables: { id: articleId }
        }).pipe(
            map(result => {
            const r = result.data?.articleRatingDown;
            if (!r) throw new Error('articleRatingDown not returned');
            return {
                id: r.id,
                title: r.title,
                content: r.content,
                rating: r.rating,
                avgRating: r.avgRating,
                votesCount: r.votesCount,
                imgSrc: r.imgSrc,
                createdAt: r.createdAt,
            } as Article;
            }),
            catchError(err => {
            console.error('Article rating down failed', err);
            throw err;
            })
        );
    }

}