import React, { Component } from 'react';
import { connect } from 'react-redux';
import topstories from '../actions/topstories.js';

class TopStories extends Component {
    constructor(props) {
        super(props)
        this.state = {};
    }

    componentWillMount = () => {
        // if (!window.localStorage.sessionData) {
        //     browserHistory.replace("/tvweb/")
        // }
    }

    componentDidMount = () => {
        this.props.dispatch({ type: "TOPSTORY_START" })
        var data = {
            "userData" : {
                "userName" : this.props.data.data.userName
            }
        }

       this.props.dispatch(topstories(data));
    }

    render = () => {
    	console.log(this.props.topStoryData, "!!!!!!!!!!!!");
    	if(this.props.loaded) {
            console.log("in loaded true")

        return (
            <div>
                { this.props.topStoryData.images.value.map((item, i) => {return(<div className="demo-card-wide mdl-card mdl-shadow--2dp">
                                    <img src = {item.thumbnailUrl} style={{"height" : "250px"}}></img>
                					
                					<div className="mdl-card__supporting-text">
                						{item.name}
                					</div>
                					
                					<div className="mdl-card__menu">
                						<button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                							<i className="material-icons">favorite</i>
                						</button>
                					</div>
                				</div>) }) 
            	}
				
            </div>
        );
    } else {
        return(<div>
        </div>)
    }
    }

    getNews = () => {
    	let subscriptionKey = '3fe4c32d0f10422aaa8a0d7e2bd9f86f';
    	let host = 'api.cognitive.microsoft.com';
		let path = '/bing/v7.0/search';
		let term = 'women entrepreneurship';

		
    }
};

const mapStateToProps = (store) => {
    return {
        data : store.loginReducer.loginData,
        loaded : store.topStoryReducer.loaded,
        topStoryData : store.topStoryReducer.topStoryData
    };
};

export default connect(mapStateToProps)(TopStories);