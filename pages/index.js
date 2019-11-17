import React from 'react'
import Layout from '../components/Layout'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import '../bootstrap.css'
import ApiCard from '../components/ApiCard'
import data from '../api.json'

export default () => {
  var result = data.items.map(v => {
    return <ApiCard image={v.image} title={v.title} description={v.description} link={v.link} />
  }) 
  return <Layout>
    <Container>
      <Grid container spacing={3}>
        {result}
      </Grid>
    </Container>
  </Layout>
}