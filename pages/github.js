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

    static getInitialProps({ query }) {
        return { query }
    }

    search() {
        var self = this
        axios.get(`https://api.github.com/search/users?q=${self.state.query}`, {
            headers: {
                Authorization: `token ${localStorage.githubAccessToken}`
            }
        }).then(res => {
            self.setState({
                searchResults: res.data.items
            })
        })
    }

    componentDidMount() {
        if (this.props.query.code) {
            axios.get(`https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${this.props.query.code}&redirect_uri=${process.env.BASE_URL}`, {
                headers: {
                    "Origin": "http://localhost:3000"
                }
            }).then(res => {
                        let valArr = res.data.split("&")
                        let val = valArr[0].split("=")
                        localStorage.githubAccessToken = val[1]
                    })
    } else if(!localStorage.githubAccessToken) {
        window.location.href = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.BASE_URL}github`
    }
}

render() {
    let results = null
    if (this.state.searchResults.length != 0) {
        results = this.state.searchResults.map((v) => {
            return <div>
                <img src={v.avatar_url} height="100" />
                <a href={v.html_url}><h2>{v.login}</h2></a>
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