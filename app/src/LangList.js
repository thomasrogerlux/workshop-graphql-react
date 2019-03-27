import React from "react";
import { Typography, Divider, Fab } from "@material-ui/core";
import { Query, Mutation } from "react-apollo";
import { deleteLangMutation } from "./mutations";
import { allLangQuery } from "./query";

export default function LangList() {
  return (
    <Mutation
      mutation={deleteLangMutation}
      refetchQueries={() => [
        {
          query: allLangQuery
        }
      ]}
    >
      {deleteLang => (
        <Query query={allLangQuery}>
          {({ loading, error, data }) => {
            if (loading) {
              return <Typography>Loading...</Typography>;
            } else if (error) {
              return <Typography>Error: {error}</Typography>;
            } else if (!data) {
              return <Typography>No data found</Typography>;
            }

            return (
              <div>
                {data.allLang.map(({ name, ext }) => (
                  <div key={`${name}-${ext}`}>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        alignItems: "center",
                        marginTop: 20,
                        justifyContent: "space-between"
                      }}
                    >
                      <Typography variant="h4">
                        {name}.{ext}
                      </Typography>
                      <Fab
                        onClick={() => {
                          deleteLang({ variables: { name } });
                        }}
                        color="secondary"
                      >
                        x
                      </Fab>
                    </div>
                    <Divider style={{ marginBottom: 20 }} />
                  </div>
                ))}
              </div>
            );
          }}
        </Query>
      )}
    </Mutation>
  );
}
