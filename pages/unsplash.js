import React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  withStyles,
  Avatar,
  IconButton,
  CardActions
} from "@material-ui/core";
import { Favorite } from "@material-ui/icons";

const styles = theme => ({
  root: {
    marginTop: theme.spacing(5)
  },
  images: {
    height: 0,
    paddingTop: "56.25%"
  },
  liked: {
    color: "red"
  }
});

class Unsplash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      currpage: 0
    };

    this.fetchImages = this.fetchImages.bind(this);
    this.likeImage = this.likeImage.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    if (this.props.query.code) {
      axios
        .get(
          `${process.env.BASE_URL}/api/unsplash?code=${this.props.query.code}`,
          {
            headers: {
              Origin: `${process.env.BASE_URL}`
            }
          }
        )
        .then(res => {
          localStorage.unsplashAccessToken = res.data.access_token;
        });
    } else if (!localStorage.unsplashAccessToken) {
      window.location.href = `https://unsplash.com/oauth/authorize?client_id=${process.env.UNSPLASH_API_KEY}&redirect_uri=${window.location.href}&response_type=code&scope=public+write_likes`;
    }
  }

  fetchImages() {
    var self = this;
    axios
      .get(`https://api.unsplash.com/photos?page=${self.state.currpage + 1}`, {
        headers: {
          Authorization: `Bearer ${localStorage.unsplashAccessToken}`
        }
      })
      .then(res => {
        self.setState((state, props) => ({
          images: [...state.images, ...res.data],
          currpage: state.currpage + 1
        }));
      });
  }

  likeImage(id, index) {
    var self = this;

    axios
      .post(`https://api.unsplash.com/photos/${id}/like`, {
        headers: {
          Authorization: `Bearer ${localStorage.unsplashAccessToken}`
        }
      })
      .then(res => {
        let temp = self.state.images;
        temp[index].liked_by_user = true;
        self.setState({
          images: temp
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container spacing={2}>
          {this.state.images.map((v, index) => (
            <Grid item xs={12} lg={6}>
              <Card>
                <CardMedia image={v.urls.regular} className={classes.images} />
                <CardContent>
                  <CardHeader
                    avatar={
                      <Avatar
                        aria-label="recipe"
                        src={v.user.profile_image.medium}
                        className={classes.avatar}
                      />
                    }
                    title={v.alt_description}
                    subheader={v.user.name}
                  />
                </CardContent>
                <CardActions>
                  {v.liked_by_user == false ? (
                    <IconButton
                      aria-label="add to favorites"
                      onClick={() => this.likeImage(v.id, index)}
                    >
                      <Favorite />
                    </IconButton>
                  ) : (
                    <IconButton
                      aria-label="add to favorites"
                      className={classes.liked}
                    >
                      <Favorite />
                    </IconButton>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid container justify="center" className={classes.root}>
          <Button color="primary" onClick={this.fetchImages} variant="outlined">
            Load more
          </Button>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Unsplash);
