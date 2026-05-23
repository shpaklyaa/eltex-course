import { gql } from "apollo-angular";

export const COMMENT_RATING_UP = gql`
mutation CommentRatingUp($id: ID!) {
  commentRatingUp(id: $id) {
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