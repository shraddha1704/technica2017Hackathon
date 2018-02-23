const myFeedReducer = (state = {

}, action) => {
    switch (action.type) {
        case "MYFEED_ERROR":
            state = {
                ...state,
                error: action.payload.response
            }
            break;
        case "MYFEED_SUCCESS":
            state = {
                ...state,
                feedFlag: true
            }
            break;
	case "MYFEEDVIEW_SUCCESS":
            state = {
                ...state,
                feedFlag: true,
                loaded : true,
                feedData : action.payload
            }
            break;
        case "MYFEEDVIEW_ERROR":
            state = {
                ...state,
                feedFlag: true
            }
            break;

        case "MYFEEDVIEW_START":
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

export default myFeedReducer;
