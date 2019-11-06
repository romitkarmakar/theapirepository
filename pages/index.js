import React from 'react'
import axios from 'axios'
import '../bootstrap.css'

export default class AccuWeather extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentStocks: null
    }
    
    this.stockLoad = this.stockLoad.bind(this)
  }

  stockLoad() {
    var self = this
    axios.get(`https://cloud.iexapis.com/stable/tops?token=${process.env.IEX_PUBLISHABLE_KEY}&symbols=aapl`).then(res => {
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
      let results = this.state.currentStocks.map((v) => {
        return <div className="card">
        <div className="card-body">
          <div className="card-title">{v.symbol}</div>
          <p>{v.lastSalePrice}</p>
        </div>
        <div className="card-footer">
          Sector: {v.sector}
        </div>
      </div>
      })
        return <div>{results}</div>
    }
    else {
      return <div>No results to show</div>
    }
  }
}