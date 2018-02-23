import axios from "axios";

export default function login(data) {
    return function(dispatch) {
        
        var baseurl = "http://localhost:9090/apis/"
        
        axios({
            method: "post",
            url: baseurl + "user/login",
            headers: {
                "Content-Type":"application/json"
            },
            data : data
        }).then(function(response) {
            dispatch({ type:"LOGIN_SUCCESS",
                payload : response.data
            });

        
        }).catch(function(error, res) {
            dispatch({
                type: "LOGIN_ERROR",
                payload: {
                    response: "Error"
                }
            });
        });
    }
}