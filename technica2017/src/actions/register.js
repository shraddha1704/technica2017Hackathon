import axios from "axios";

export default function register(data) {
    return function(dispatch) {
        
        var baseurl = "http://localhost:9090/apis/"
        
        axios({
            method: "post",
            url: baseurl + "user/signup",
            headers: {
                "Content-Type":"application/json"
            },
            data : data
        }).then(function(response) {
            console.log("=============", response);
            dispatch({ type:"LOGIN_SUCCESS",
                payload : response.data
            });
        })
    }
}