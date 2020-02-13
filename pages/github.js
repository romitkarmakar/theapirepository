import React from "react";
import Link from "next/link";
import axios from "axios";
import {
  TextField,
  Grid,
  Button,
  Container,
  Card,
  CardContent,
  CardActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@material-ui/core";

export default class Github extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchResults: []
    };
    this.search = this.search.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  search() {
    var self = this;
    axios
      .get(`https://api.github.com/search/users?q=${self.state.query}`, {
        headers: {
          Authorization: `token ${localStorage.githubAccessToken}`
        }
      })
      .then(res => {
        self.setState({
          searchResults: res.data.items
        });
      });
  }

  componentDidMount() {
    if (this.props.query.code) {
      axios
        .get(`${process.env.BASE_URL}/api/github?code=${this.props.query.code}`, {
          headers: {
            Origin: `${process.env.BASE_URL}`
          }
        })
        .then(res => {
          if (res.data == "bad_verification_code") return;
          localStorage.githubAccessToken = res.data;
        });
    } else if (!localStorage.githubAccessToken) {
      window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}/github`;
    }
  }

  render() {
    let results = null;
    if (this.state.searchResults.length != 0) {
      results = this.state.searchResults.map(v => {
        return (
          <ListItem>
            <ListItemAvatar>
            <img src={v.avatar_url} height="50" />
            </ListItemAvatar>
            <ListItemText primary={v.login} />
          </ListItem>
        );
      });
    } else {
      results = <div>No results to show</div>;
    }
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <TextField
                  label="Search User"
                  variant="outlined"
                  margin="dense"
                  fullWidth
                  value={this.state.query}
                  onChange={e => this.setState({ query: e.target.value })}
                />
                <List>
                {results}
                </List>
                
              </CardContent>
              <CardActions>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={this.search}
                >
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
