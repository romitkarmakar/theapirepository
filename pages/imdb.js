import React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  List,
  CardActions,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  withStyles,
  Typography,
  IconButton
} from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

const styles = theme => ({
  dialog: {
    maxWidth: 1500
  },
  spacing: {
    marginTop: theme.spacing(2)
  },
  dialogImage: {
    maxHeight: 300,
    borderRadius: 10
  },
  imgContainer: {
    margin: "auto",
    display: "flex",
    justifyContent: "center"
  }
});
class Imdb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSearch: "",
      results: [],
      details: null,
      modal: false
    };
    this.search = this.search.bind(this);
    this.details = this.details.bind(this)
  }

  search() {
    var self = this;
    axios
      .get(
        `https://www.omdbapi.com/?s=${self.state.currentSearch}&apikey=${process.env.OMDB_API_KEY}`
      )
      .then(response => {
        self.setState({
          results: response.data.Search
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  details(val) {
    var self = this;
    self.setState({
        modal: true
    })
    axios
      .get(
        `https://www.omdbapi.com/?i=${val}&plot=full&apikey=${process.env.OMDB_API_KEY}`
      )
      .then(res => {
        self.setState({
          details: res.data
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={2} justify="center">
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Search Movie" />
                <TextField
                  variant="outlined"
                  fullWidth
                  value={this.state.currentSearch}
                  onChange={e =>
                    this.setState({ currentSearch: e.target.value })
                  }
                  label="Enter Movie name"
                />
                <List>
                  {this.state.results.map(v => (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={v.Poster} />
                      </ListItemAvatar>
                      <ListItemText primary={v.Title} secondary={v.Year} />
                      <IconButton onClick={() =>this.details(v.imdbID)}>
                          <ArrowForward />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={() => this.search()}>
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Dialog
          className={classes.dialog}
          open={this.state.modal}
          onClose={() => this.setState({ modal: false })}
        >
          {this.state.details != null ? <DialogContent>
            <CardHeader
              title={this.state.details.Title}
              subheader={`${this.state.details.Genre}, ${this.state.details.Year}`}
            />
            <Grid container spacing={2}>
              <Grid item xs={12} lg={4} className={classes.imgContainer}>
                <img
                  className={classes.dialogImage}
                  src={this.state.details.Poster}
                />
              </Grid>
              <Grid item xs={12} lg={8}>
                <DialogContentText>
                  {this.state.details.Plot}
                </DialogContentText>
                <DialogContentText>
                  Director: {this.state.details.Director}
                </DialogContentText>
                <DialogContentText>
                  Actors: {this.state.details.Actors}
                </DialogContentText>
              </Grid>
            </Grid>
            <DialogContentText className={classes.spacing}>{this.state.details.Language}, {this.state.details.Country}</DialogContentText>
            <DialogContentText>
              Production: {this.state.details.Production}
            </DialogContentText>
            <DialogContentText>
              Awards: {this.state.details.Awards}
            </DialogContentText>
            <DialogContentText>
              Rating:
              {this.state.details.Ratings.map(v => <Typography>{v.Source}: {v.Value}</Typography>)}
            </DialogContentText>
          </DialogContent>: null}
          <DialogActions>
            <Button
              color="primary"
              onClick={() => this.setState({ modal: false })}
            >
              CLOSE
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

export default withStyles(styles)(Imdb);
