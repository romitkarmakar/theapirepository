import React from 'react'
import Link from 'next/link'
import axios from 'axios'

export default class Github extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query: "",
            searchResults: []
        }
        this.search = this.search.bind(this)
    }

    search() {
        var self = this
        axios.get(`https://api.stackexchange.com/2.2/search?page=1&pagesize=5&order=desc&sort=activity&intitle=${self.state.query}&site=stackoverflow`).then(res => {
            self.setState({
                searchResults: res.data.items
            })
        })
    }

render() {
    let results = null
    if (this.state.searchResults.length != 0) {
        results = this.state.searchResults.map((v) => {
            return <div>
                <a href={v.link}><h2>{v.title}</h2></a>
        <h3>Question by {v.owner.display_name}</h3>
            </div>
        })
    } else {
        results = <div>No results to show</div>
    }
    return <div>
        <input className="form-control" placeholder="Search User" value={this.state.query} onChange={(e) => this.setState({ query: e.target.value })} />
        <button onClick={this.search}>Search</button>
        {results}
    </div>

}
}