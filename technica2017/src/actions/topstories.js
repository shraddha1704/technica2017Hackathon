import axios from "axios";

export default function topstories(data) {
    return function(dispatch) {
        
        var baseurl = "https://api.cognitive.microsoft.com/"
        var searchstring = "women+entrepreneurship";
        let subscriptionKey = '3fe4c32d0f10422aaa8a0d7e2bd9f86f';
        axios({
            method: "get",
            url: baseurl + "/bing/v7.0/search?q=" + searchstring,
            headers: {
                "Content-Type":"application/json",
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        }).then(function(response) {
            console.log(response);
            dispatch({ type:"TOPSTORY_SUCCESS",
                payload : response.data
            });

        
        }).catch(function(error, res) {
            dispatch({
                type: "TOPSTORY_ERROR",
                payload: {
                    response: "Error"
                }
            });
        });
    }
}
