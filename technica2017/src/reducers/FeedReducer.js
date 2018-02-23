const feedReducer = (state = {

}, action) => {
    switch (action.type) {
        case "FEED_ERROR":
            state = {
                ...state,
                error: action.payload.response
            }
            break;
        case "FEED_SUCCESS":
            state = {
                ...state,
                feedFlag: true
            }
            break;
	case "FEEDVIEW_SUCCESS":
            state = {
                ...state,
                feedFlag: true,
                loaded : true,
                feedData : action.payload
            }
            break;
        case "FEEDVIEW_ERROR":
            state = {
                ...state,
                feedFlag: true
            }
            break;

        case "FEEDVIEW_START":
            state = {
                ...state,
                loaded: false,
                ready: false,
                pageno: 1
            }
            break;
    }
    return state;
}

export default feedReducer;
