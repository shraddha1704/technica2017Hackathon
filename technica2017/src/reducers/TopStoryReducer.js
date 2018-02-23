const topStoryReducer = (state = {

}, action) => {
    switch (action.type) {
        
	       case "TOPSTORY_SUCCESS":
                console.log("==================")
                state = {
                    ...state,
                    feedFlag: true,
                    loaded : true,
                    topStoryData : action.payload
                }

                console.log("state", state);
            break;
        case "TOPSTORY_ERROR":
            state = {
                ...state,
                feedFlag: true
            }
            break;

        case "TOPSTORY_START":
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

export default topStoryReducer;
