import React from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Weather from '../components/accuweather/weather'

export default class Accuweather extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query: '',
            results: []
        }

        this.search = this.search.bind(this)
    }

    search() {
        var self = this
        axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${process.env.ACCUWEATHER_KEY}&q=${self.state.query}`).then(res => {
            self.setState({
                results: res.data
            })
        })
    }

    render() {
        let results = null
        if (this.state.results.length != 0) {
            results = this.state.results.map((v) => {
                return <Card>
                    <CardContent>
                        <Typography><h2>{v.EnglishName}</h2></Typography>
                        <Typography>
                            <h3>{v.AdministrativeArea.EnglishName}, {v.Country.EnglishName}</h3>
                        </Typography>
                    </CardContent>
                    <Weather id={v.Key} />
                </Card>
            })
        } else {
            results = <div>No results to show</div>
        }

        return <Layout>
             <TextField
                id="standard-basic"
                label="Search Place"
                margin="normal"
                value={this.state.query}
                onChange={(e) => this.setState({ query: e.target.value })}
            />
            <Button variant="contained" color="primary" onClick={this.search}>
                Search
            </Button>
            {results}
        </Layout>
    }
}