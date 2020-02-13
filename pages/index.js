import React from "react";
import Layout from "../components/Layout";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import ApiCard from "../components/ApiCard";
import data from "../api.json";

import LogRocket from "logrocket";
LogRocket.init("mk6dd2/theapirepository");

export default () => {
  return (
    <Layout>
      <Container>
        <Grid container spacing={3}>
          {data.items.map(v => (
            <ApiCard
              image={v.image}
              title={v.title}
              description={v.description}
              link={v.link}
            />
          ))}
        </Grid>
      </Container>
    </Layout>
  );
};
