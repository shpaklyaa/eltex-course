import { gql } from "apollo-angular";

export const ARTICLE_RATING_UP = gql`
mutation ArticleRatingUp($id: ID!) {
  articleRatingUp(id: $id) {
    id
    title
    content
    rating
    avgRating
    votesCount
    imgSrc
    createdAt
  }
}
`;