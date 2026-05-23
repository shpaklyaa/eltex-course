import { gql } from "apollo-angular";

export const VOTE_COMMENT = gql`
  mutation VoteComment($id: ID!, $vote: Float!) {
    voteComment(id: $id, vote: $vote) {
      id
      rating
      avgRating
      votesCount
    }
  }
`;