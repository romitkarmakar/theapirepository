import React from "react";
import axios from "axios";
import {
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  CardHeader,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText
} from "@material-ui/core";
import { ArrowRight, ArrowForward } from "@material-ui/icons";
import data from "../content/iexcloud.json";

export default class IEXCloud extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cryptocurrencies: data.cryptocurrencies,
      stocks: data.stocks,
      selectedSymbol: "",
      news: [],
      isOpen: false
    };

    this.stockLoad = this.stockLoad.bind(this);
    this.cryptoLoad = this.cryptoLoad.bind(this);
    this.onSymbolClick = this.onSymbolClick.bind(this);
  }

  cryptoLoad() {
    var self = this;
    this.state.cryptocurrencies.map((v, index) => {
      axios
        .get(
          `https://cloud.iexapis.com/stable/crypto/${v.symbol}/price?token=${process.env.IEX_PUBLISHABLE_KEY}`
        )
        .then(res => {
          let temp = self.state.cryptocurrencies;
          Object.assign(temp[index], { price: res.data.price });

          self.setState({
            cryptocurrencies: temp
          });
        });
    });
  }

  stockLoad() {
    var self = this;
    this.state.stocks.map((v, index) => {
      axios
        .get(
          `https://cloud.iexapis.com/stable/stock/${v.symbol}/quote?token=${process.env.IEX_PUBLISHABLE_KEY}`
        )
        .then(res => {
          let temp = self.state.stocks;
          Object.assign(temp[index], {
            name: res.data.companyName,
            price: res.data.latestPrice
          });

          self.setState({
            stocks: temp
          });
        });
    });
  }

  onSymbolClick(symbol) {
    var self = this;
    this.setState({
      isOpen: true,
      selectedSymbol: symbol
    })
    axios
      .get(
        `https://cloud.iexapis.com/stable/stock/${symbol}/news?token=${process.env.IEX_PUBLISHABLE_KEY}`
      )
      .then(res => {
        self.setState({
          news: res.data
        });
      });
  }

  componentDidMount() {
    this.cryptoLoad();
    this.stockLoad();
  }

  render() {
    return (
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <CardHeader title="CryptoCurrencies List" />
                <List>
                  {this.state.cryptocurrencies.map((v, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={v.name}
                        secondary={`$.${v.price}/-`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <CardHeader title="Stocks List" />
                <List>
                  {this.state.stocks.map((v, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={v.name}
                        secondary={`$.${v.price}/-`}
                      />
                      <IconButton onClick={e => this.onSymbolClick(v.symbol)} >
                        <ArrowForward />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Dialog
          open={this.state.isOpen}
          onClose={e => this.setState({ isOpen: false })}
        >
          <DialogTitle>{this.state.selectedSymbol} News</DialogTitle>
          <DialogContent>
            <DialogContentText>
              <List>
                {this.state.news.map((v, index) => (
                  <ListItem>
                    <ListItemText>{v.headline}</ListItemText>
                  </ListItem>
                ))}
              </List>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Container>
    );
  }
}
