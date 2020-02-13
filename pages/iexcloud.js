import React from 'react'
import axios from 'axios'

export default class IEXCloud extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStocks: null
    }
    
    this.stockLoad = this.stockLoad.bind(this)
  }

  stockLoad() {
    var self = this
    axios.get(`https://cloud.iexapis.com/stable/stock/AAPL/quote?token=${process.env.IEX_PUBLISHABLE_KEY}`).then(res => {
      self.setState({
        currentStocks: res.data
      })
    })
  }

  componentDidMount() {
    this.stockLoad()
  }

  render() {
    if (this.state.currentStocks != null) {
      let results = <div className="card">
        <div className="card-body">
          <div className="card-title">{this.state.currentStocks.symbol}</div>
          <p>{this.state.currentStocks.latestPrice}</p>
        </div>
        <div className="card-footer">
          Name: {this.state.currentStocks.companyName}
        </div>
      </div>
        return <div>{results}</div>
    }
    else {
      return <div>No results to show</div>
    }
  }
}