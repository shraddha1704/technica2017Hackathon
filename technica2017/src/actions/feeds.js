import axios from "axios";

export default function feeds(data) {
    return function(dispatch) {
        
        var baseurl = "http://localhost:9090/apis/"
        
        axios({
            method: "post",
            url: baseurl + "feeds/insert",
            headers: {
                "Content-Type":"application/json"
            },
            data : data
        }).then(function(response) {
            dispatch({ type:"FEED_SUCCESS",
                payload : response.data
            });

        
        }).catch(function(error, res) {
            dispatch({
                type: "FEED_ERROR",
                payload: {
                    response: "Error"
                }
            });
        });
    }
}
