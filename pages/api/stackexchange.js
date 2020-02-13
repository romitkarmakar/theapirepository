import axios from "axios";

export default (req, res) => {
  axios
    .get(
      `https://api.stackexchange.com/2.2/search?page=1&pagesize=5&order=desc&sort=activity&intitle=${req.query.id}&site=stackoverflow`
    )
    .then(response => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(response.data));
    });
};
