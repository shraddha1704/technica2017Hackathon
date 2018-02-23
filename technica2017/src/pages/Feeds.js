import React, { Component } from 'react';
import { connect } from 'react-redux';
import SkyLight from 'react-skylight';
import feeds from '../actions/feeds.js';
import feedsview from '../actions/feedsview.js';
import ring from '../images/1.jpg';

class Feeds extends Component {
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
        this.props.dispatch({ type: "FEEDVIEW_START" })
        var data = {
            "userData" : {
                "userName" : this.props.data.data.userName
            }
        }

       this.props.dispatch(feedsview(data));
       this.props.history.push('/technica/feeds');
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

    uploadFeed = () => {
            var data = {
                "data" : {
                	"userData" : {
                        userName : this.props.data.data.userName
                	},
                	"feedData" : {
                		feed : document.getElementById('feed').value,
                		image : this.state.image
                	}
                }
            }
           this.props.dispatch(feeds(data));
           this.feedDialog.hide();
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
            	<button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" onClick={() => this.feedDialog.show()} style={{"float" : "right", "marginRight": "1%"}}>
				  <i className="material-icons">edit</i>
				</button>
				<SkyLight hideOnOverlayClicked ref={ref => this.feedDialog = ref}>
		            <div className="container">
		              <div className="feed-info animated">
		              	<br />
		              	<br />
		              	<label htmlFor="feed"><span>Feed</span></label>
		              	<br />
		              	<br />
		              	<textarea type="text" rows="6" cols="90" id="feed"/>
		              	<br />
		              	<br />
		              	<label htmlFor="image"><span>Image</span></label>
		              	<br />
		              	<br />
		              	<input type="file" rows="6" cols="90" id="image" onChange = {this.handleImage}/>
		              	<br />
		              	<button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick = {this.uploadFeed}>
						  Upload
						</button>
		              </div>
		            </div>
		          </SkyLight>
                { this.props.feedData.data.map((item, i) => {return(<div className="demo-card-wide mdl-card mdl-shadow--2dp">
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
        <button className="mdl-button mdl-js-button mdl-button--fab mdl-button--colored" onClick={() => this.feedDialog.show()} style={{"float" : "right", "marginRight": "1%"}}>
                  <i className="material-icons">edit</i>
                </button>
                <SkyLight hideOnOverlayClicked ref={ref => this.feedDialog = ref}>
                    <div className="container">
                      <div className="feed-info animated">
                        <br />
                        <br />
                        <label htmlFor="feed"><span>Feed</span></label>
                        <br />
                        <br />
                        <textarea type="text" rows="6" cols="90" id="feed"/>
                        <br />
                        <br />
                        <label htmlFor="image"><span>Image</span></label>
                        <br />
                        <br />
                        <input type="file" rows="6" cols="90" id="image" onChange = {this.handleImage}/>
                        <br />
                        <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick = {this.uploadFeed}>
                          Upload
                        </button>
                      </div>
                    </div>
                  </SkyLight>
        </div>)
    }
    }
};

const mapStateToProps = (store) => {
    return {
        data : store.loginReducer.loginData,
        loaded : store.feedReducer.loaded,
        feedData : store.feedReducer.feedData
    };
};

export default connect(mapStateToProps)(Feeds);