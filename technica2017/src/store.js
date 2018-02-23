import { createStore, combineReducers, applyMiddleware } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
//import logger from "redux-logger";
import { syncHistoryWithStore, routerReducer } from 'react-router-redux';
import loginReducer from './reducers/LoginReducer.js';
import registerReducer from './reducers/RegisterReducer.js';
import feedReducer from './reducers/FeedReducer.js';
import topStoryReducer from './reducers/TopStoryReducer.js';
import myFeedReducer from './reducers/MyFeedReducer.js';

const store = createStore(combineReducers({ loginReducer, registerReducer, feedReducer, topStoryReducer, myFeedReducer }), {}, applyMiddleware( thunk, promise()));
export default store;