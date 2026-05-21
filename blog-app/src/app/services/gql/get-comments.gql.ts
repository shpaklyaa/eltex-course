import { gql } from "apollo-angular";

export const GET_COMMENTS = gql`
query CommentsByArticle {
    commentsByArticle(articleId: null) {
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