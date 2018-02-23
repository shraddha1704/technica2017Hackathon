const registerReducer = (state = {

}, action) => {
    switch (action.type) {
        case "REGISTER_ERROR":
            state = {
                ...state,
                error: action.payload.response
            }
            break;
        case "REGISTER_SUCCESS":
            state = {
                ...state,
                loginData: action.payload,
                loginFlag: true
            }
            break;
    }
    return state;
}

export default registerReducer;
