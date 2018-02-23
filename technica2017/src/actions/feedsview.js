import axios from "axios";

export default function feedsview(data) {
    return function(dispatch) {
        
        var baseurl = "http://localhost:9090/apis/"
        
        axios({
            method: "post",
            url: baseurl + "feeds/getfeeds",
            headers: {
                "Content-Type":"application/json"
            },
            data : data
        }).then(function(response) {
            console.log(response);
            dispatch({ type:"FEEDVIEW_SUCCESS",
                payload : response.data
            });

        
        }).catch(function(error, res) {
            dispatch({
                type: "FEEDVIEW_ERROR",
                payload: {
                    response: "Error"
                }
            });
        });
    }
}
