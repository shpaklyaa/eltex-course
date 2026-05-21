import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { catchError, Observable, of, map } from 'rxjs';
import { Coment } from '../../types/coment';
import { GET_COMMENTS } from '../gql/get-comments.gql';
import { CommentsByArticle } from '../../types/comments-gql-response.type'
import { ADD_COMMENT } from '../gql/add-comment.gql';


@Injectable()
export class GqlService {
    private apollo = inject(Apollo);

    getCommentsForArticle(articleId: string): Observable<Coment[]> {
        return this.apollo.query<CommentsByArticle>({
            query: GET_COMMENTS,
            variables: { articleId },
            fetchPolicy: 'no-cache'
        }).pipe(
            map((result: Apollo.QueryResult<CommentsByArticle>) => result.data?.comments ?? []),
            catchError((e) => {
                console.error(e);
                return of([]);
            })
        );
    }
  
    create(commentData: Omit<Coment, 'id'>): Observable<void> {
        return this.apollo.mutate({
            mutation: ADD_COMMENT,
            variables: {
                createComment: {
                    ...commentData
                }
            },
        }).pipe(map(() => void 0));
    }

}