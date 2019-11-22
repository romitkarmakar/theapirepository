import React from 'react'
import axios from 'axios'
import Layout from '../Layout'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

export default class Weather extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            result: null,
            icon: ""
        }
    }

    componentDidMount() {
        var self = this
        axios.get(`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${self.props.id}?apikey=${process.env.ACCUWEATHER_KEY}`).then(res => {
            self.setState({
                result: res.data,
                icon: `https://developer.accuweather.com/sites/default/files/${("0" + res.data.DailyForecasts[0].Day.Icon).slice(-2)}-s.png`
            })
        })
    }

    render() {
        if (this.state.result != null)
            return <Card>
                <CardContent>
                    <img src={this.state.icon} />
                    <Typography>{this.state.result.Headline.Text}</Typography>
                    <Typography>{this.state.result.DailyForecasts[0].Day.IconPhrase}</Typography>
                </CardContent>
            </Card>
        else return <div></div>
    }
}