import { API_URL } from '../helpers/config';


export const getUser = id => dispatch => {


    fetch(`${API_URL}/user/${id}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(result => result.json())
        .then(result => {
            if(result.errors) {
                console.log(result.errors);
            }else{
                dispatch({
                    type: "GET_USER",
                    payload: { Msg: result.msg, User: result.data }
                });
            }
        })
        .catch(err => console.log(err) )

}