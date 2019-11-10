import React, { Component } from "react";
import axios from "axios";

class spotify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      results: []
    };
  }

  login() {
    axios
      .get("https://accounts.spotify.com/authorize", {
        params: {
          client_id: "cc0cc9e331d9471588f4a2a81217d6e9",
          response_type: "token",
          redirect_uri: "http://localhost:3000/spotify",
          scope: "user-access-private user-access-email"
        }
      })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <div>
        hey!
        <button onClick={this.login}>Click me</button>
      </div>
    );
  }
}

export default spotify;
