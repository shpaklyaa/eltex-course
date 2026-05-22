import { gql } from "apollo-angular";

export const GET_COMMENTS = gql`
query CommentsByArticle($articleId: ID!) {
    commentsByArticle(articleId: $articleId) {
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