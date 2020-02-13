import axios from "axios";

export default (req, res) => {
  axios
    .get(
      `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${req.query.code}&redirect_uri=${process.env.BASE_URL}/github`,
      {
        headers: {
            "Origin": "http://localhost:3000"
        }
      }
    )
    .then(response => {
      let valArr = response.data.split("&");
      let val = valArr[0].split("=");

      res.statusCode = 200;
      res.setHeader("Content-Type", "text/plain");
      res.end(val[1]);
    });
};
