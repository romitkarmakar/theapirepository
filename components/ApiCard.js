import React from 'react'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Link from 'next/link'

export default (props) => {
    return <Grid item xs={6}>
    <Card>
      <CardActionArea>
        <CardMedia
          image={props.image}
          title={props.title}
          style={{height: '200px'}}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
          {props.title}
    </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
           {props.description}
    </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
            <Link href={props.link}>Explore</Link>
  </Button>
        
      </CardActions>
    </Card>
  </Grid>
}