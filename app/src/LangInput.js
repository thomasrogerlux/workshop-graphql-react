import React, { useState } from "react";
import { Mutation } from "react-apollo";
import { TextField, Button } from "@material-ui/core";
import { addLangMutation } from "./mutations";
import { allLangQuery } from "./query";

export default function LangInput() {
  const [name, setName] = useState("");
  const [ext, setExt] = useState("");

  return (
    <Mutation
      mutation={addLangMutation}
      refetchQueries={() => [
        {
          query: allLangQuery
        }
      ]}
      variables={{
        name,
        ext
      }}
    >
      {addLang => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <TextField
              label="Name"
              value={name}
              onChange={event => setName(event.target.value)}
            />
            <TextField
              label="Ext"
              value={ext}
              onChange={event => setExt(event.target.value)}
            />
            <Button
              style={{ marginTop: 20 }}
              color="primary"
              variant="contained"
              onClick={addLang}
            >
              Add New Lang
            </Button>
          </div>
        );
      }}
    </Mutation>
  );
}
