import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  CardActions
} from "@material-ui/core";

class Imgur extends Component {
  constructor(props) {
    super(props);

    this.state = {
      result: [],
      search: ""
    };

    this.search = this.search.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    var parsedHash = new URLSearchParams(window.location.hash.substr(1));
    if (parsedHash.get("access_token") != null) {
      localStorage.imgurAccessToken = parsedHash.get("access_token");
    } else if (!localStorage.imgurAccessToken) {
      window.location.href = `https://api.imgur.com/oauth2/authorize?response_type=token&client_id=${process.env.IMGUR_CLIENT_ID}`;
    }
  }

  search() {
    var self = this;
    axios
      .get(
        `https://api.imgur.com/3/gallery/search/time/all/1?q=${this.state.search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.imgurAccessToken}`
          }
        }
      )
      .then(res => {
        self.setState({
          result: res.data.data
        });
      });
  }

  render() {
    return (
      <Container>
        <Grid container justify="center">
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <TextField
                  value={this.state.search}
                  fullWidth
                  variant="outlined"
                  onChange={e => this.setState({ search: e.target.value })}
                  label="Search Imgur"
                />
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={this.search}>
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {this.state.result.map(v => {
            if (v.images) {
              if (v.images[0].type == "image/gif")
                return (
                  <Grid item xs={12} lg={6}>
                    <video width="320" height="240" controls>
                      <source src={v.images[0].mp4} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Grid>
                );
              else if (v.images[0].type == "video/mp4")
                return (
                  <Grid item xs={12} lg={6}>
                    <video width="320" height="240" controls>
                      <source src={v.images[0].mp4} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </Grid>
                );
              else
                return (
                  <Grid item xs={12} lg={6}>
                    <img src={v.images[0].link} height="200" />
                  </Grid>
                );
            } else {
              return <div></div>;
            }
          })}
        </Grid>
      </Container>
    );
  }
}

export default Imgur;
