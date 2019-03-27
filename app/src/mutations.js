import gql from "graphql-tag";

export const addLangMutation = gql`
  mutation AddLang($name: String, $ext: String) {
    addLang(name: $name, ext: $ext) {
      name
      ext
    }
  }
`;

export const deleteLangMutation = gql`
  mutation DeleteLang($name: String) {
    deleteLang(name: $name) {
      name
      ext
    }
  }
`;
