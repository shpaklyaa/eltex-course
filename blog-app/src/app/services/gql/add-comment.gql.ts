import { gql } from "apollo-angular";

export const ADD_COMMENT = gql`
mutation CreateComment {
    createComment(createComment: null) {
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