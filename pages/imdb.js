import React from 'react'
import axios from 'axios'

export default class Imdb extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentSearch: '',
            results: []
        }
        this.search = this.search.bind(this)
    }

    search() {
        var self = this
        axios({
            "method": "GET",
            "url": "https://movie-database-imdb-alternative.p.rapidapi.com/",
            "headers": {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "movie-database-imdb-alternative.p.rapidapi.com",
                "x-rapidapi-key": process.env.RAPIDAPI_KEY
            }, "params": {
                "page": "1",
                "r": "json",
                "s": self.state.currentSearch
            }
        })
            .then((response) => {
                self.setState({
                    results: response.data.Search
                })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        let searchBox = <div>
            <input type="text" value={this.state.currentSearch} onChange={(e) => this.setState({currentSearch: e.target.value})} />
            <button onClick={this.search}>Search</button>
        </div>
        if(this.state.results.length != 0) {
            let result = this.state.results.map((v) => {
                return <div>
                    <img src={v.Poster} height="100" />
                    <h2>{v.Title}</h2>
                    <h3>{v.Year}</h3>
                </div>
            })
            return <div>
                {searchBox}
                {result}
            </div>
        } else {
            return <div>
                {searchBox}
                <p>No results to show</p>
            </div>
        }
    }
}