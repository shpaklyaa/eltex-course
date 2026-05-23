import { gql } from "apollo-angular";

export const COMMENT_RATING_DOWN = gql`
mutation CommentRatingDown($id: ID!) {
  commentRatingDown(id: $id) {
    id
    articleId
    username
    content
    rating
    votesCount
    avgRating
    createdAt
  }
}
`;