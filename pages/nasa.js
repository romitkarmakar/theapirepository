import React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  CardMedia,
  withStyles,
  ButtonGroup,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField
} from "@material-ui/core";

const styles = theme => ({
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  }
});

class Nasa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apod: {},
      mars: [],
      sol: 1000,
      currentIndex: 0
    };

    this.apodLoad = this.apodLoad.bind(this);
    this.curiosityLoad = this.curiosityLoad.bind(this);
    this.onSolChange = this.onSolChange.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
  }

  apodLoad() {
    var self = this;
    axios
      .get(
        `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`
      )
      .then(res => {
        self.setState({
          apod: res.data
        });
      });
  }

  curiosityLoad() {
    var self = this;
    axios
      .get(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=${self.state.sol}&page=1&api_key=${process.env.NASA_API_KEY}`
      )
      .then(res => {
        self.setState({
          mars: res.data.photos
        });
      });
  }

  onSolChange(number) {
    this.setState((state, props) => ({
      sol: state.sol + number
    }));
  }

  onImageChange(number) {
    if (this.state.mars.length <= this.state.currentIndex + number) return;
    if (this.state.currentIndex + number < 0) return;
    this.setState((state, props) => ({
      currentIndex: state.currentIndex + number
    }));
  }

  componentDidMount() {
    this.apodLoad();
    this.curiosityLoad();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.sol != prevState.sol) this.curiosityLoad();
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardMedia
                className={classes.media}
                image={this.state.apod.url}
              ></CardMedia>
              <CardContent>
                <CardHeader
                  title="Astronomy Picture of the Day"
                  subheader={this.state.apod.date}
                />
                <Typography>{this.state.apod.explanation}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            {this.state.mars.length > 0 ? (
              <Card>
                <CardMedia
                  className={classes.media}
                  image={this.state.mars[this.state.currentIndex].img_src}
                ></CardMedia>
                <CardContent>
                  <CardHeader
                    title="Curiosity Mars Capture"
                    subheader={
                      this.state.mars[this.state.currentIndex].camera.full_name
                    }
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} lg={6}>
                      <Typography>Select Mars Day: </Typography>
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        <Button onClick={e => this.onSolChange(-1)}>-</Button>
                        <TextField value={this.state.sol} onChange={e => this.setState({sol: e.target.value})}/>
                        <Button onClick={e => this.onSolChange(1)}>+</Button>
                      </ButtonGroup>
                    </Grid>
                    <Grid item xs={12} lg={6}>
                      <Typography>Select Mars Image: </Typography>
                      <ButtonGroup
                        color="primary"
                        aria-label="outlined primary button group"
                      >
                        <Button onClick={e => this.onImageChange(-1)}>-</Button>
                        <Button>{this.state.currentIndex}</Button>
                        <Button onClick={e => this.onImageChange(1)}>+</Button>
                      </ButtonGroup>
                    </Grid>
                  </Grid>

                  <Typography>
                    Rover Name:{" "}
                    {this.state.mars[this.state.currentIndex].rover.name}
                  </Typography>
                  <Typography>
                    Rover Landing Date:{" "}
                    {
                      this.state.mars[this.state.currentIndex].rover
                        .landing_date
                    }
                  </Typography>
                  <Typography>
                    Rover Launch Date:{" "}
                    {this.state.mars[this.state.currentIndex].rover.launch_date}
                  </Typography>
                  <Typography>Rover Cameras:</Typography>
                  <List>
                    {this.state.mars[this.state.currentIndex].rover.cameras.map(
                      v => (
                        <ListItem>
                          <ListItemText primary={v.full_name} />
                        </ListItem>
                      )
                    )}
                  </List>
                </CardContent>
              </Card>
            ) : null}
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Nasa);
