import React, { Component } from "react";
import axios from "axios";
import qs from 'qs';

class Imgur extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: [],
            search: ''
        }

        this.search = this.search.bind(this)
    }

    static getInitialProps({ query }) {
        return { query }
    }

    componentDidMount() {
        var self = this
        if (this.props.query.code) {
            axios({
                method: 'post',
                url: '	https://api.imgur.com/oauth2/token',
                data: qs.stringify({
                    "grant_type": "authorization_code",
                    "code": self.props.query.code,
                    "client_id": process.env.IMGUR_CLIENT_ID,
                    "client_secret": process.env.IMGUR_CLIENT_SECRET
                }),
                headers: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                }
            }).then(res => {
                localStorage.imguraccessToken = res.data.access_token
                localStorage.imgurrefreshToken = res.data.refresh_token
            }).catch(res => res.data)
        }
    }

    login() {
        var URL = 'https://api.imgur.com/oauth2/authorize' +
            '?response_type=code' +
            '&client_id=' + process.env.IMGUR_CLIENT_ID;
        window.location.href = URL;
    }

    search() {
        var self = this
        axios.get(`https://api.imgur.com/3/gallery/search/time/all/1?q=${this.state.search}`, {
            headers: {
                "Authorization": `Bearer ${localStorage.imguraccessToken}`
            }
        }).then(res => {
            self.setState({
                result: res.data.data
            })
        })
    }

    render() {
        let data = null
        if (this.state.result.length != 0) {
            data = this.state.result.map(v => {
                if (v.images) {
                    if (v.images[0].type == "image/gif") return <video width="320" height="240" controls>
                        <source src={v.images[0].mp4} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    else if (v.images[0].type == "video/mp4") return <video width="320" height="240" controls>
                        <source src={v.images[0].mp4} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    else return <img src={v.images[0].link} height="200" />
                } else {
                    return <div></div>
                }
            })
        } else {
            data = <div></div>
        }
        return (
            <div>
                hey!
        <button onClick={this.login}>Click me</button>
                <input type="text" value={this.state.search} onChange={(e) => this.setState({ search: e.target.value })} />
                <button onClick={this.search}>Search</button>
                {data}
            </div>
        );
    }
}

export default Imgur;
