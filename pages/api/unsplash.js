import axios from "axios"

export default (req, res) => {
    axios
      .post(`https://unsplash.com/oauth/token`, {
        client_id: process.env.UNSPLASH_API_KEY,
        client_secret: process.env.UNSPLASH_API_SECRET,
        code: req.query.code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.BASE_URL}/unsplash`
      })
      .then(response => {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data));
      })
      .catch(err => console.log(err));
};
