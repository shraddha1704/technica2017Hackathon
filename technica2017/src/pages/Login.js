import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import login from '../actions/login.js';
import '../css/loginstyle.css';
import '../css/animate.css';

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginButton: <button id= "loginButton" onClick={() => this.handleLogin()}>Sign In</button>,
            deviceType: false
        };
    }


    componentWillMount = () => {
        
    }

    handleLogin = () => {
        var loginButton = <button id= "loginButton" disabled><i>Logging In...</i></button>
        this.setState({ loginButton: loginButton })
        var data = {
            "userData" :{
                    userName : document.getElementById('username').value,
                    password : document.getElementById('password').value
            }
        }
        this.props.dispatch(login(data));
        
    }

    componentDidUpdate = () => {
        if (this.props.error) {
            if (this.props.flag) {
                this.props.history.push('/technica/feeds');
            } else {
                var loginButton = <button id="loginButton" onClick={() => this.handleLogin()}>Sign In</button>
                this.setState({ loginButton: loginButton });
                document.getElementById("error").style.visibility = "visible";
            }
        } else {
            if (this.props.flag) {
                this.props.history.push('/technica/feeds');
            }
        }
    }

    callFunc = (e) => {
        if(e.keyCode == 13){
            var loginButton = <button id= "loginButton" disabled><i>Logging In...</i></button>
            this.setState({loginButton : loginButton})
            var data = {
                "userData" :{
                    userName : document.getElementById('username').value,
                    password : document.getElementById('password').value
                }
            }
            this.props.history.push('/technica/feeds');
            this.props.dispatch(login(data));
        }
    }

    render = () => {

        return (
            <div className="container">
              <div className="top">
                <h1 id="title"><span id="logo">Technica <span>2017</span></span></h1>
              </div>
              <div className="login-box animated fadeInUp">
                <div className="box-header">
                  <h2>Log In</h2>
                </div>
                <br/>            
                <label style={{"color":"red", "visibility" : "hidden"}} id="error">Username or password is incorrect!</label>
                <br />
                <label htmlFor="username">User ID</label>
                <br/>
                <input type="text" id="username" />
                <br/>
                <label htmlFor="password">Password</label>
                <br/>
                <input type="password" id="password" onKeyDown={this.callFunc} /> 
                <br/>
                {this.state.loginButton}
                <br/>
                <br/>            
                <label>If you have not yet registered, <Link style={{"color":"#00bcd4"}} to="/technica/register">Sign Up</Link>, here</label>
                <br />
              </div>
            </div>
        )
    }
};

const mapStateToProps = (store) => {
    return {
        error: store.loginReducer.error,
        flag: store.loginReducer.loginFlag
    };
};

export default connect(mapStateToProps)(Login);
