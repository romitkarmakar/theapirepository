import React from "react";
import Link from "next/link";
import axios from "axios";
import {
  Container,
  Grid,
  CardContent,
  CardActions,
  Card,
  TextField,
  Button,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
  List,
  Typography,
  CardHeader
} from "@material-ui/core";

export default class Github extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      searchResults: [],
      info: []
    };
    this.search = this.search.bind(this);
    this.getSiteInfo = this.getSiteInfo.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    var parsedHash = new URLSearchParams(window.location.hash.substr(1));
    if (parsedHash.get("access_token") != null) {
      localStorage.stackexchangeAccessToken = parsedHash.get("access_token");
    } else if (!localStorage.stackexchangeAccessToken) {
      window.location.href = `https://stackoverflow.com/oauth/dialog?client_id=${process.env.STACKEXCHANGE_CLIENT_ID}&scope=no_expiry&redirect_uri=${process.env.BASE_URL}/stackexchange`;
    }
  }

  getSiteInfo() {
    var self = this;
    axios
      .get(
        `https://api.stackexchange.com/2.2/info?site=stackoverflow&access_token=${localStorage.stackexchangeAccessToken}&key=${process.env.STACKEXCHANGE_KEY}`
      )
      .then(res => {
        var temp = [];
        for (const [key, value] of Object.entries(res.data.items[0])) {
          temp.push({
            key: key,
            value: value
          });
        }
        self.setState({
          info: temp
        });
      });
  }

  search() {
    var self = this;
    axios
      .get(
        `${process.env.BASE_URL}/api/stackexchange?id=${self.state.query}&access_token=${localStorage.stackexchangeAccessToken}`
      )
      .then(res => {
        self.setState({
          searchResults: res.data.items
        });
      });
  }

  render() {
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <TextField
                  id="standard-basic"
                  label="Search Topic"
                  margin="normal"
                  fullWidth
                  variant="outlined"
                  value={this.state.query}
                  onChange={e => this.setState({ query: e.target.value })}
                />
                <List>
                  {this.state.searchResults.map(v => (
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar src={v.owner.profile_image} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={v.title}
                        secondary={v.owner.display_name}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.search}
                >
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                  <CardHeader title="About Stack Overflow" />
                  {this.state.info.map(v => <Typography>{v.key.replace(/_/g, " ")}: {v.value}</Typography>)}
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.getSiteInfo}
                >
                  Get Site Info
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}
