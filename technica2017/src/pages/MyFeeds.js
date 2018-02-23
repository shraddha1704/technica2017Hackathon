import React, { Component } from 'react';
import { connect } from 'react-redux';
import SkyLight from 'react-skylight';
import myfeedsview from '../actions/myfeedsview.js';
import ring from '../images/1.jpg';

class MyFeeds extends Component {
    constructor(props) {
        super(props)
        this.state = {
        	image : "",
        	isFeed : false
        };
    }

    componentWillMount = () => {
    }

    componentDidMount = () => {
        this.props.dispatch({ type: "MYFEEDVIEW_START" })
        var data = {
            "userData" : {
                "userName" : this.props.data.data.userName
            }
        }

       this.props.dispatch(myfeedsview(data));
    }


    handleImage = () => {
    	console.log("here");
    	var reader = new FileReader();
	    var f = document.getElementById("image").files;

	    reader.onloadend = () => {
	        this.setState({image : reader.result});
	    }
	    reader.readAsDataURL(f[0]);
    }

    render = () => {
        if(this.props.loaded) {
            console.log("in loaded true")

        if(this.props.data.data.role == "Sponsor") {
            var icon = "money";
        } else {
            var icon = "share";
        }

        return (
            <div>
                { this.props.myFeedData.data.map((item, i) => {return(<div className="demo-card-wide mdl-card mdl-shadow--2dp">
                                    <img src = {"http://localhost:8081/static/" + item._source.feedId + ".jpg"} style={{"height" : "250px"}}></img>
                					
                					<div className="mdl-card__supporting-text">
                						{item._source.feed}
                					</div>
                					
                					<div className="mdl-card__menu">
                						<button className="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                							<i className="material-icons">{icon}</i>
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
};

const mapStateToProps = (store) => {
    return {
        data : store.loginReducer.loginData,
        loaded : store.myFeedReducer.loaded,
        myFeedData : store.myFeedReducer.feedData
    };
};

export default connect(mapStateToProps)(MyFeeds);
