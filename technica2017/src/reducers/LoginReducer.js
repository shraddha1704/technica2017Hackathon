const loginReducer = (state = {

}, action) => {
    switch (action.type) {
        case "LOGIN_ERROR":
            state = {
                ...state,
                error: action.payload.response
            }
            break;
        case "LOGIN_SUCCESS":
            state = {
                ...state,
                loginData: action.payload,
                loginFlag: true
            }
            break;
    }
    return state;
}

export default loginReducer;
