import axios from "axios";

export default (req, res) => {
  if (req.query.type == "topcities") {
    axios
      .get(
        `http://dataservice.accuweather.com/locations/v1/topcities/50?apikey=${process.env.ACCUWEATHER_KEY}`
      )
      .then(response => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(response.data));
      });
  }
};
