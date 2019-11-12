import React, { Component } from "react";
import axios from "axios";
import qs from "qs";
import "../bootstrap.css";
class spotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profile: null,
      query: "",
      albums: [],
      tracks: []
    };

    this.myProfile = this.myProfile.bind(this);
  }

  static getInitialProps({ query }) {
    return { query };
  }

  componentDidMount() {
    var self = this;
    if (this.props.query.code) {
      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: qs.stringify({
          grant_type: "authorization_code",
          code: self.props.query.code,
          redirect_uri: "http://localhost:3000/spotify",
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8"
        }
      })
        .then(res => {
          localStorage.spotifyaccessToken = res.data.access_token;
          localStorage.spotifyrefreshToken = res.data.refresh_token;
        })
        .catch(res => res.data);
    }
  }

  login() {
    var URL =
      "https://accounts.spotify.com/authorize" +
      "?response_type=code" +
      "&client_id=" +
      process.env.SPOTIFY_CLIENT_ID +
      "&scope=" +
      encodeURIComponent("user-read-private user-read-email") +
      "&redirect_uri=" +
      encodeURIComponent("http://localhost:3000/spotify");
    window.location.href = URL;
  }

  myProfile() {
    var self = this;
    axios
      .get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${localStorage.spotifyaccessToken}`
        }
      })
      .then(res => {
        self.setState({
          profile: res.data
        });
      });
  }

  findQuery = () => {
    axios
      .get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${localStorage.spotifyaccessToken}`
        },
        params: {
          q: this.state.query,
          type: "album,track"
        }
      })
      .then(res => {
        this.setState({
          albums: res.data.albums.items,
          tracks: res.data.tracks.items
        });
      })
      .catch(err => console.log(err));
  };

  render() {
    let data = null;
    if (this.state.profile != null) {
      data = (
        <div>
          <h1>{this.state.profile.display_name}</h1>
          <h2>{this.state.profile.email}</h2>
        </div>
      );
    } else {
      data = <div></div>;
    }
    return (
      <div>
        hey!
        <button onClick={this.login}>Click me</button>
        <button onClick={this.myProfile}>Get Profile</button>
        <input
          value={this.state.query}
          onChange={e => this.setState({ query: e.target.value })}
          placeholder="Enter song or album name"
        ></input>
        <button onClick={this.findQuery}>Search</button>
        {data}
        {this.state.tracks.map(song => {
          return (
            <div>
              <img src={song.album.images[0].url}></img>
              <span>{song.album.name}</span>
              <p>Released in: {song.album.release_date}</p>
              <p>
                Sung by:
                {song.album.artists.map(artist => (
                  <span>{artist.name}</span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
}

export default spotify;
