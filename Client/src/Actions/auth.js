import { API_URL } from '../helpers/config';
import { checkExpToken } from '../helpers/checkExpToken';


export const signUp = data => {
    return {
        type: 'signUp',
        payload: data
    }
}


export const signIn = data => {

    localStorage.setItem('signIn', true);

    return {
        type: 'signIn',
        payload: data
    }
}


export const activeAccount = data => {
    return {
        type: 'activeAccount',
        payload: data
    }
}


export const RefreshToken = () => dispatch => {

    let signIn = localStorage.getItem('signIn');
    if(signIn !== "true") return;


    fetch(`${API_URL}/RefreshToken/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then(res => res.json())
        .then(result => {
            if(result.errors) {
                console.log(result.errors);
            }else {
                dispatch({
                    type: 'RefreshToken',
                    payload: { Msg: result.msg, User: { _id: result.User._id, name: result.User.name , role: result.User.role }, Token: result.AccessToken }
                });
            }
        })
        .catch(err => console.error(err))

}


export const signOut = token => async (dispatch) => {

    const access_token = await checkExpToken(token, dispatch);
    token = access_token ? access_token : token;

    localStorage.removeItem('signIn');
    window.location.href = "/";

    fetch(`${API_URL}/signout/`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        credentials: 'include'
    })
        .then(result => result.json())
        .then(res => ( 
                dispatch({
                    type: 'signOut',
                    payload: { Msg: res.msg }
                })                 
            ))
        .catch(err => console.error(err))
                    
}


export const forgotPassword = data => {

    return {
        type: 'forgotPassword',
        payload: data
    }
}