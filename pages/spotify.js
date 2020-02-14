import React, { Component } from "react";
import axios from "axios";
import qs from "qs";
import {
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  CardActions,
  Button,
  Link,
  IconButton,
  withStyles
} from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

const styles = theme =>({
  root: {
    padding: theme.spacing(1)
  }
})
class Spotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      query: "",
      tracks: [],
      newReleases: [],
      logged_in: false
    };

    this.myProfile = this.myProfile.bind(this);
    this.fetchNewReleases = this.fetchNewReleases.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    var self = this;
    if (this.props.query.code) {
      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: qs.stringify({
          grant_type: "authorization_code",
          code: self.props.query.code,
          redirect_uri: `${process.env.BASE_URL}/spotify`,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      })
        .then(res => {
          localStorage.spotifyaccessToken = res.data.access_token;
          localStorage.spotifyrefreshToken = res.data.refresh_token;
          self.setState({ logged_in: true });
          self.myProfile();
          self.fetchNewReleases();
        })
        .catch(res => res.data);
    } else {
      if (localStorage.spotifyaccessToken) {
        this.setState({ logged_in: true });
        self.myProfile();
        self.fetchNewReleases();
      } else this.login();
    }
  }

  login() {
    var URL =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      process.env.SPOTIFY_CLIENT_ID +
      "&scope=" +
      encodeURIComponent("user-read-private user-read-email") +
      "&redirect_uri=" +
      encodeURIComponent(`${process.env.BASE_URL}/spotify`);
    window.location.href = URL;
  }

  myProfile() {
    var self = this;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${localStorage.spotifyaccessToken}`
        }
      })
      .then(res => {
        self.setState({
          profile: res.data
        });
      }).catch(err => {
        self.login();
      });
  }

  fetchNewReleases() {
    var self = this;
    axios
      .get("https://api.spotify.com/v1/browse/new-releases", {
        headers: {
          Authorization: `Bearer ${localStorage.spotifyaccessToken}`
        }
      })
      .then(res => {
        self.setState({
          newReleases: res.data.albums.items
        });
      });
  }

  findQuery = () => {
    axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${localStorage.spotifyaccessToken}`
        },
        params: {
          q: this.state.query,
          type: "album,track"
        }
      })
      .then(res => {
        this.setState({
          tracks: res.data.tracks.items
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container justify="center" className={classes.root}>
          <Grid item xs={12} lg={6}>
            {this.state.profile != null ? (
              <Card>
                <CardContent>
                  <CardHeader
                    avatar={<Avatar src={this.state.profile.images[0].url} />}
                    title={this.state.profile.display_name}
                    subheader={this.state.profile.email}
                  />
                  <Typography>Followers: {this.state.profile.followers.total} </Typography>
                </CardContent>
                <CardActions>
                  <Link href={this.state.profile.external_urls.spotify}><Button color="primary">Go to Profile</Button></Link>
                </CardActions>
              </Card>
            ) : null}
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.root}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Search for Albums" />
                <TextField
                  fullWidth
                  variant="outlined"
                  value={this.state.query}
                  onChange={e => this.setState({ query: e.target.value })}
                  label="Search Songs"
                />
                <List>
                  {this.state.tracks.map(song => {
                    return (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={song.album.images[2].url} height="100" />
                        </ListItemAvatar>
                        <ListItemText
                          primary={song.album.name}
                          secondary={`Released in: ${song.album.release_date}`}
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={this.findQuery}>
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="New Releases" />
                <List>
                  {this.state.newReleases.map(song => {
                    return (
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar src={song.images[2].url} height="100" />
                        </ListItemAvatar>
                        <ListItemText primary={song.name} />
                        <Link href={song.external_urls.spotify}>
                          <IconButton>
                            <ArrowForward />
                          </IconButton>
                        </Link>
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Spotify);
