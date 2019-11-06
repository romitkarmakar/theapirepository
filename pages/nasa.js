import React from 'react'
import axios from 'axios'
import '../bootstrap.css'

export default class Nasa extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      apod: null
    }
    
    this.apodLoad = this.apodLoad.bind(this)
  }

  apodLoad() {
    var self = this
    axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`).then(res => {
      self.setState({
        apod: res.data
      })
    })
  }

  componentDidMount() {
    this.apodLoad()
  }

  render() {
    if (this.state.apod != null) {
      if (this.state.apod.media_type == "image")
        return <div className="card">
          <img src={this.state.apod.url} alt={this.state.apod.title} height="200"/>
          <div className="card-body">
            <div className="card-title">{this.state.apod.title}</div>
            <p>{this.state.apod.explanation}</p>
          </div>
          <div className="card-footer">
            {this.state.apod.date}
          </div>
        </div>
    }
    else {
      return <div>No results to show</div>
    }
  }
}