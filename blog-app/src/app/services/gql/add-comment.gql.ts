import { gql } from "apollo-angular";

export const ADD_COMMENT = gql`
mutation CreateComment($createComment: CreateCommentInput!) {
    createComment(createComment: $createComment) {
        articleId
        avgRating
        content
        createdAt
        id
        rating
        username
        votes
        votesCount
    }
}
`;