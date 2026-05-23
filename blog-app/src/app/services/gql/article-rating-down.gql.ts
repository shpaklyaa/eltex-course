import { gql } from "apollo-angular";

export const ARTICLE_RATING_DOWN = gql`
mutation ArticleRatingDown($id: ID!) {
  articleRatingDown(id: $id) {
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