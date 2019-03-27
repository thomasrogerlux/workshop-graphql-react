import React from "react";
import { Typography } from "@material-ui/core";
import LangList from "./LangList";
import LangInput from "./LangInput";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h2" style={{ alignSelf: "center" }}>
        The Programming Languages List
      </Typography>
      <LangInput />
      <LangList />
    </div>
  );
}
