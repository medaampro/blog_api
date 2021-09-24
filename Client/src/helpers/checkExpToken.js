import jwt_decode from "jwt-decode";
import { API_URL } from './config';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

export const checkExpToken = async (token, dispatch) => {

    let decoded = jwt_decode(token);   
    let date = Date.now() / 1000;
    let newToken = "";

    if(decoded.exp >= date) {
        return newToken;
    }else {

        await fetch(`${API_URL}/RefreshToken/`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors) {
                    toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }else {
                    newToken = result.AccessToken;
                    dispatch({
                        type: 'RefreshToken',
                        payload: { Msg: result.msg, User: { _id: result.User._id, name: result.User.name , role: result.User.role }, Token: result.AccessToken }
                    });
                }
            })
            .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}))

        return newToken;
    }    
}
