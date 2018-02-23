import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import register from '../actions/register.js';
import '../css/loginstyle.css';
import '../css/animate.css';

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginButton: <button id= "loginButton" onClick={() => this.handleLogin()}>Register</button>,
            deviceType: false
        };
    }
    
    handleLogin = () => {
        var loginButton = <button id= "loginButton" disabled><i>Signing you up....</i></button>
        this.setState({ loginButton: loginButton })
        var data = {
            "userData" :{
                    userName : document.getElementById('username').value,
                    password : document.getElementById('setPassword').value,
                    fullName : document.getElementById('fullname').value,
                    dob : document.getElementById('dob').value,
                    emailId : document.getElementById('emailid').value,
                    phoneNum : document.getElementById('phoneNum').value,
                    role : document.getElementById('role').value,
                    zipCode : document.getElementById('zipcode').value

            }
        }
        this.props.dispatch(register(data));
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
            var loginButton = <button id= "loginButton" disabled><i>Signing you up...</i></button>
            this.setState({loginButton : loginButton})
            var data = {
                "userData" :{
                        userName : document.getElementById('username').value,
                        password : document.getElementById('setPassword').value,
                        fullName : document.getElementById('fullname').value,
                        dob : document.getElementById('dob').value,
                        emailId : document.getElementById('emailid').value,
                        phoneNum : document.getElementById('phoneNum').value,
                        role : document.getElementById('role').value,
                        zipCode : document.getElementById('zipcode').value
                }
            }
           this.props.history.push('/technica/feeds');
           this.props.dispatch(register(data));
        }
    }

    render = () => {

        return (
            <div className="container">
              <div className="login-box animated fadeInUp">
                <div className="box-header">
                  <h2>Register</h2>
                </div>
                <label htmlFor="fullname">Full Name</label>
                <br/>
                <input type="text" id="fullname"/>
                <br/>
                <label htmlFor="username">Username</label>
                <br/>
                <input type="text" id="username" /> 
                <br />
                <label htmlFor="dob">Date of Birth( MM/DD/YYYY )</label>
                <br/>
                <input type="date" id="dob" />
                <br/>
                <label htmlFor="emailid">Email ID</label>
                <br/>
                <input type="text" id="emailid" />
                <br/>
                <label htmlFor="phoneNum">Phone Number</label>
                <br/>
                <input type="text" id="phoneNum" />
                <br/>
                <label htmlFor="zipcode">Zip Code</label>
                <br/>
                <input type="text" id="zipcode" />
                <br/>
                <label htmlFor="role">Role</label>
                <br/>
                <select type="select" id = "role" style = {{"width" : "38%", "height" : "40px"}}>
                    <option value="" selected disabled hidden>Choose here</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Sponsor">Sponsor</option>
                </select>
                <br/>
                <br/>
                <label htmlFor="setPassword">Set Password</label>
                <br/>
                <input type="password" id="setPassword"/> 
                <br/>
                {this.state.loginButton}
              </div>
            </div>
        )
    }
};

const mapStateToProps = (store) => {
    return {
        error: store.registerReducer.error,
        flag: store.loginReducer.loginFlag
    };
};

export default connect(mapStateToProps)(Register);
