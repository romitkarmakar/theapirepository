import React from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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
        axios.post(`https://google-translate1.p.rapidapi.com/language/translate/v2`, {
            "target":"es",
            "q":`${self.state.query}`
            }, {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "x-rapidapi-host": "google-translate1.p.rapidapi.com",
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY
                }
            }).then((response) => {
                self.setState({
                    results: res.data.data.translations
                })
            })
            .catch((error) => {
                console.log(error)
            })            
    }

    render() {
        let results = null
        if (this.state.results.length != 0) {
            results = this.state.results.map((v) => {
                return <Card>
                    <CardContent>
                        <Typography><h2>{v.translatedText}</h2></Typography>
                    </CardContent>
                </Card>
            })
        } else {
            results = <div>No results to show</div>
        }

        return <Layout>
            <TextField
                id="standard-basic"
                label="Enter Text to translate into Hindi"
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