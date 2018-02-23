import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import store from "./store.js";
import { Provider } from "react-redux";
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import NavBar from './components/NavBar.js';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';

const mount = document.getElementById('root');

injectTapEventPlugin();
console.log(store.getState());
store.subscribe(() => {})

ReactDOM.render(
    <Provider store={store}>
		<BrowserRouter>
			<div>
				<Route path="/technica/login" component={Login} />
				<Route path="/technica/register" component={Register} />
				<Route path="/technica/feeds" component={NavBar} />	
			</div>		
		</BrowserRouter>	
	</Provider>, mount);