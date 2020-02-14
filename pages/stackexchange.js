import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import Layout from '../components/Layout'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default class Github extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            query: "",
            searchResults: []
        }
        this.search = this.search.bind(this)
    }

    search() {
        var self = this
        axios.get(`${process.env.BASE_URL}/api/stackexchange?id=${self.state.query}`).then(res => {
            self.setState({
                searchResults: res.data.items
            })
        })
    }

    render() {
        let results = null
        if (this.state.searchResults.length != 0) {
            results = this.state.searchResults.map((v,index) => {
                return <Card key={index}>
                    <CardContent>
                        <Typography variant="h5" component="h5">{v.title}</Typography>
                        <Typography>
                            Question by {v.owner.display_name}
                        </Typography>
                    </CardContent>
                    <CardActions>
                    <Button size="small"><a href={v.link}>Learn More</a></Button>
                    </CardActions>
                </Card>
            })
        } else {
            results = <div>No results to show</div>
        }
        return <Layout>
            <TextField
                id="standard-basic"
                label="Search Topic"
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