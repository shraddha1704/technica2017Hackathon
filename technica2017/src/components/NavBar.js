import React, {Component} from 'react';
import { connect } from 'react-redux';
import Profile from '../pages/Profile.js';
import Feeds from '../pages/Feeds.js';
import AroundYou from '../pages/AroundYou.js';
import TopStories from '../pages/TopStories.js';
import MyFeeds from '../pages/MyFeeds.js';
import SkyLight from 'react-skylight';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

const styles = {
  contentHeaderMenuLink: {
    textDecoration: 'none',
    color: 'white'
  }
};

class NavBar extends Component{
  constructor(props){
    super(props)
    this.state = {
    };
  }

  handleLogout = () => {
    // localStorage.clear();
    // //this.props.dispatch({ type: "USER_LOGOUT"});
    // browserHistory.replace('/technica/');
  }

  componentDidMount = () => {
  }

  render = () => {
    return (
      <Router>
        <div>
          <SkyLight hideOnOverlayClicked ref={ref => this.simpleDialog = ref}>
                      <div className="container">
                        <div className="user-info animated">
                          <br/>
                          <label htmlFor="fullname"><span>Full Name</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.fullName}</span></label>
                          <br/>
                          <br/>
                          <br/>
                          <label htmlFor="username"><span>Username</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.userName}</span></label>
                          <br/>
                          <br/>
                          <br/>
                          <label htmlFor="dob"><span>Date of Birth</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.dob}</span></label>
                          <br/>
                          <br/>
                          <br/>
                          <label htmlFor="emailid"><span>Email ID</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.emailId}</span></label>
                          <br/>
                          <br/>
                          <br/>
                          <label htmlFor="phoneNum"><span>Phone Number</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.phoneNum}</span></label>
                          <br/>
                          <br/>
                          <br/>
                          <label htmlFor="role"><span>Role</span><span style={{"float" : "right", "textTransform": "none"}}>{this.props.data.data.role}</span></label>
                          <br/>
                        </div>
                      </div>
                    </SkyLight>
          <span>
            <ul className="navbar-top">
              <li className="navbar-item">
                <a href="#" onClick={() => this.simpleDialog.show()}>Profile</a>
              </li>
              <li className="navbar-item">
                <Link to="/technica/feeds" >Feeds</Link>
              </li>
              <li className="navbar-item">
                <Link to="/technica/aroundyou" >Around You</Link>
              </li>
              <li className="navbar-item">
                <Link to="/technica/topstories" >Top Stories</Link>
              </li>
              <li className="navbar-item">
                <Link to="/technica/myfeeds" >My Feeds</Link>
              </li>
              <li className="navbar-item" style={{ "float" : "right" }}><a href="javascript:void(0)" onClick = {() => this.handleLogout()}>Logout</a></li>
            </ul>
          </span>
          <Route exact path="/technica/feeds" component={Feeds}/>
          <Route exact path="/technica/aroundyou" component={AroundYou}/>
          <Route exact path="/technica/topstories" component={TopStories}/>
          <Route exact path="/technica/myfeeds" component={MyFeeds}/>
        </div>
      </Router>
    );
  };
};

const mapStateToProps=(store) => {
    return{
       data : store.loginReducer.loginData
    };
};

export default connect(mapStateToProps)(NavBar);