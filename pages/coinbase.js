import React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  withStyles,
  Typography
} from "@material-ui/core";

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

class Coinbase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      details: {}
    };

    this.fetchCurrencies = this.fetchCurrencies.bind(this);
  }

  componentDidMount() {
    var self = this;
    axios.get("https://api.coinbase.com/v2/prices/BTC-USD/buy").then(res => {
      self.setState((state, props) => ({
        details: Object.assign(state.details, { buy: res.data.data.amount })
      }));
    });
    axios.get("https://api.coinbase.com/v2/prices/BTC-USD/sell").then(res => {
      self.setState((state, props) => ({
        details: Object.assign(state.details, { sell: res.data.data.amount })
      }));
    });
    axios.get("https://api.coinbase.com/v2/prices/BTC-USD/spot").then(res => {
      self.setState((state, props) => ({
        details: Object.assign(state.details, { spot: res.data.data.amount })
      }));
    });
  }

  fetchCurrencies() {
    var self = this;
    axios.get("https://api.coinbase.com/v2/currencies").then(res => {
      self.setState({
        currencies: res.data.data
      });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <Container>
        <Grid container justify="center">
          <Grid item xs={12} lg={6}>
            <Card>
              <CardHeader title="Bitcoin prices" />
              <CardContent>
                <Typography>Buy Price: $.{this.state.details.buy}</Typography>
                <Typography>Sell Price: $.{this.state.details.sell}</Typography>
                <Typography>Spot Price: $.{this.state.details.spot}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {this.state.currencies.map((v, index) => (
            <Grid item xs={6} lg={3}>
              <CardHeader title={v.id} subheader={v.name} />
            </Grid>
          ))}
        </Grid>
        <Grid container justify="center" className={classes.root}>
          <Button
            color="primary"
            onClick={this.fetchCurrencies}
            variant="outlined"
          >
            Load Currencies
          </Button>
        </Grid>
      </Container>
    );
  }
}

export default withStyles(styles)(Coinbase);
