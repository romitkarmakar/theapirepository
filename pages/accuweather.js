import React from "react";
import axios from "axios";
import Weather from "../components/accuweather/weather";
import { Container } from "next/app";
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton
} from "@material-ui/core";
import { ArrowForward } from "@material-ui/icons";

export default class Accuweather extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      results: [],
      topcities: [],
      regions: [],
      countries: [],
      selectedRegion: "",
      selectedCountry: "",
      adminareas: [],
      modal: false,
      ipInformation: null
    };

    this.search = this.search.bind(this);
    this.fetchTopCities = this.fetchTopCities.bind(this);
    this.fetchRegions = this.fetchRegions.bind(this);
    this.fetchCountries = this.fetchCountries.bind(this);
    this.fetchIPInfo = this.fetchIPInfo.bind(this);
  }

  fetchTopCities() {
    var self = this;
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/topcities/50?apikey=${process.env.ACCUWEATHER_KEY}`
      )
      .then(res => {
        self.setState({
          topcities: res.data
        });
      });
  }

  fetchRegions() {
    var self = this;
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/regions?apikey=${process.env.ACCUWEATHER_KEY}`
      )
      .then(res => {
        self.setState({
          regions: res.data
        });
      });
  }

  fetchCountries(val) {
    this.setState({
      selectedRegion: val
    });
    var self = this;
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/countries/${val}?apikey=${process.env.ACCUWEATHER_KEY}`
      )
      .then(res => {
        self.setState({
          countries: res.data
        });
      });
  }

  fetchAdminAreas(val) {
    this.setState({
      selectedCountry: val,
      modal: true
    });
    var self = this;
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/adminareas/${val}?apikey=${process.env.ACCUWEATHER_KEY}`
      )
      .then(res => {
        self.setState({
          adminareas: res.data
        });
      });
  }

  fetchIPInfo() {
    var self = this;
    axios.get("https://api.ipify.org/?format=json").then(response => {
      axios
        .get(
          `http://dataservice.accuweather.com/locations/v1/cities/ipaddress?apikey=${process.env.ACCUWEATHER_KEY}&q=${response.data.ip}`
        )
        .then(res => {
          self.setState({
            ipInformation: Object.assign(res.data, {IPAddress: response.data.ip})
          });
        });
    });
  }

  search() {
    var self = this;
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCUWEATHER_KEY}&q=${self.state.query}`
      )
      .then(res => {
        self.setState({
          results: res.data
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
                <CardHeader title="Search Places" />
                <TextField
                  variant="outlined"
                  value={this.state.query}
                  fullWidth
                  onChange={e => this.setState({ query: e.target.value })}
                  label="Search Places"
                />
                <List>
                  {this.state.results.map(v => (
                    <ListItem>
                      <ListItemText
                        primary={v.EnglishName}
                        secondary={`${v.AdministrativeArea.EnglishName}, ${v.Country.EnglishName}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={e => this.search()}>
                  Search
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Top Cities" />
                <List>
                  {this.state.topcities.map(v => (
                    <ListItem>
                      <ListItemText
                        primary={v.EnglishName}
                        secondary={`${v.AdministrativeArea.EnglishName}, ${v.Country.EnglishName}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={e => this.fetchTopCities()}>
                  Fetch List
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Region List" />
                <List>
                  {this.state.regions.map(v => (
                    <ListItem>
                      <ListItemText primary={v.EnglishName} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={e => this.fetchRegions()}>
                  Fetch List
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Country List" />
                <FormControl fullWidth>
                  <InputLabel>Select Region</InputLabel>
                  <Select
                    value={this.state.selectedRegion}
                    onChange={e => this.fetchCountries(e.target.value)}
                    autoWidth={true}
                    variant="outlined"
                  >
                    {this.state.regions.map(v => (
                      <MenuItem value={v.ID}>{v.EnglishName}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <List>
                  {this.state.countries.map(v => (
                    <ListItem>
                      <ListItemText primary={v.EnglishName} />
                      <IconButton onClick={() => this.fetchAdminAreas(v.ID)}>
                        <ArrowForward />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={e => this.fetchRegions()}>
                  Fetch List
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <CardHeader title="Your IP Information" />
                {this.state.ipInformation != null ? (
                  <React.Fragment>
                    <Typography>
                      IP Address: {this.state.ipInformation.IPAddress}
                    </Typography>
                    <Typography>
                      Location: {this.state.ipInformation.EnglishName}
                    </Typography>
                    <Typography>
                      Region: {this.state.ipInformation.Region.EnglishName}
                    </Typography>
                    <Typography>
                      Country: {this.state.ipInformation.Country.EnglishName}
                    </Typography>
                    <Typography>
                      Time Zone: {this.state.ipInformation.TimeZone.Name}
                    </Typography>
                  </React.Fragment>
                ) : null}
              </CardContent>
              <CardActions>
                <Button color="primary" onClick={e => this.fetchIPInfo()}>
                  Fetch IP Information
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.modal}
          onClose={() => this.setState({ modal: false })}
        >
          <DialogTitle>Admin Areas List</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This list includes all the admin areas in ypir selected country.
            </DialogContentText>
            <List>
              {this.state.adminareas.map(v => (
                <ListItem>
                  <ListItemText
                    primary={v.EnglishName}
                    secondary={v.EnglishType}
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <Button
            onClick={() => this.setState({ modal: false })}
            color="primary"
          >
            Close
          </Button>
        </Dialog>
      </Container>
    );
  }
}
