import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, Observable, of, map, switchMap } from 'rxjs';
import { Coment } from '../../types/coment';
import { GET_COMMENTS } from '../gql/get-comments.gql';
import { CommentsByArticle } from '../../types/comments-gql-response.type'
import { ADD_COMMENT } from '../gql/add-comment.gql';
import { AddComment } from '../../types/add-comment-gql-response.type';
import { VOTE_COMMENT } from '../gql/vote-comment.gql'


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
}