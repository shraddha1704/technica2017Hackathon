import axios from "axios";

export default function myfeedsview(data) {
    return function(dispatch) {
        
        var baseurl = "http://localhost:9090/apis/"
        
        axios({
            method: "post",
            url: baseurl + "feeds/myfeeds",
            headers: {
                "Content-Type":"application/json"
            },
            data : data
        }).then(function(response) {
            console.log(response);
            dispatch({ type:"MYFEEDVIEW_SUCCESS",
                payload : response.data
            });

        
        }).catch(function(error, res) {
            dispatch({
                type: "MYFEEDVIEW_ERROR",
                payload: {
                    response: "Error"
                }
            });
        });
    }
}
