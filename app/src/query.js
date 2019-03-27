import gql from "graphql-tag";

export const allLangQuery = gql`
  {
    allLang {
      name
      ext
    }
  }
`;
