# Workshop App React GraphQL Docker

## Installation de NodeJS

Rendez-vous sur le site https://nodejs.org/en/ pour télécharger et installer la dernière version de NodeJS (minimum version 8 pour ce workshop).

Vous pouvez également l’installer via votre gestionnaire de paquet favoris, cependant, dans ce cas, veuillez installer également le paquet `npm` ou `yarn`.

Sur Fedora :

```shell
$ sudo dnf install nodejs
```

## Initialisation de notre projet

On initialize notre projet

```shell
$ npm install -g create-react-app
```

Cette commande vous ajoute la commande create-react-app.

Puis dans le directory que vous voulez lancez :

```shell
$ create-react-app app
$ cd app
```

## Installation des dépendences de notre projet

Nous allons utiliser plusieurs librairies :

- `apollo-boost` : Librairie GraphQL pour le coté client
- `react-apollo`: Fait le lien entre Apollo et React
- `graphql` : Utilisé par Apollo
- `@material-ui/core`: Des composants react material

Pour les installer :

```shell
$ npm install --save apollo-boost graphql @material-ui/core react-apollo
```

## Setup d'une webapp ReactJS basique

Dans votre terminal :

```shell
$ npm start
```

Vous verrez alors un hello world apparaite si vous visitez http://localhost:3000

Supprimez tout dans votre dossier `src` sauf `App.js` et `index.js`

Fichier `App.js` :

```js
import React from "react";
import { Button, Typography } from "@material-ui/core";

export default function App() {
  return (
    <>
      <Typography>Hello World</Typography>
      <Button>Click Me</Button>
    </>
  );
}
```

Fichier `index.js`

```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

## Affichage de data depuis un mock

On crée un fichier `LangList.js` :

```js
import React from "react";
import { Typography, Divider } from "@material-ui/core";

const langs = [
  {
    name: "Javascript",
    ext: "js"
  },
  {
    name: "GraphQL",
    ext: "gql"
  }
];

export default function LangList() {
  return (
    <div>
      {langs.map(({ name, ext }) => (
        <>
          <div
            style={{
              flexDirection: "row",
              display: "flex",
              alignItems: "center",
              marginTop: 20,
              justifyContent: "center"
            }}
          >
            <Typography variant="h4">{name}</Typography>
            <Typography variant="h5">(.{ext})</Typography>
          </div>
          <Divider style={{ marginBottom: 20 }} />
        </>
      ))}
    </div>
  );
}
```

Et on met à jour `App.js`

```js
import React from "react";
import { Typography } from "@material-ui/core";
import LangList from "./LangList";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Typography variant="h2" style={{ alignSelf: "center" }}>
        The Programming Languages List
      </Typography>
      <LangList />
    </div>
  );
}
```

## Integration de GraphQL avec la librairie Apollo

`index.js`
```js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4000"
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

`LangList.js`
```js
import React from "react";
import { Typography, Divider } from "@material-ui/core";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const allLangQuery = gql`
  {
    allLang {
      name
      ext
    }
  }
`;

export default function LangList() {
  return (
    <Query query={allLangQuery}>
      {({ loading, error, data }) => {
        if (loading) {
          return <Typography>Loading...</Typography>
        } else if (error) {
          return <Typography>Error: {error}</Typography>
        } else if (!data) {
          return <Typography>No data found</Typography>
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
                    justifyContent: "center"
                  }}
                >
                  <Typography variant="h4">{name}</Typography>
                  <Typography variant="h5">(.{ext})</Typography>
                </div>
                <Divider style={{ marginBottom: 20 }} />
              </div>
            ))}
          </div>
        );
      }}
    </Query>
  );
}
```

## Ajout d'un input pour créer un nouveau Lang

`LangInput.js`
```js
import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { TextField, Button } from "@material-ui/core";

const addLangMutation = gql`
  mutation AddLang($name: String, $ext: String) {
    addLang(name: $name, ext: $ext) {
      name
      ext
    }
  }
`;

export default function LangInput() {
  const [name, setName] = useState("");
  const [ext, setExt] = useState("");

  return (
    <Mutation
      mutation={addLangMutation}
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
```

`App.js`
```js
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
```

## Supprimer un Lang

`LangList.js`
```js
import React from "react";
import { Typography, Divider, Fab } from "@material-ui/core";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";

const allLangQuery = gql`
  {
    allLang {
      name
      ext
    }
  }
`;

const deleteLangMutation = gql`
  mutation DeleteLang($name: String) {
    deleteLang(name: $name) {
      name
      ext
    }
  }
`;

export default function LangList() {
  return (
    <Mutation mutation={deleteLangMutation}>
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
```

## Refresh automatique des data

`mutations.js`
```js
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
```

`query.js`
```js
import gql from "graphql-tag";

export const allLangQuery = gql`
  {
    allLang {
      name
      ext
    }
  }
`;
```

`LangInput.js`
```js
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
```

`LangList.js`
```js
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
```
