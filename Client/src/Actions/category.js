import { API_URL } from '../helpers/config';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { checkExpToken } from '../helpers/checkExpToken';

export const createCategory = (name, token, push) => async dispatch => {

    const access_token = await checkExpToken(token, dispatch);
    token = access_token ? access_token : token;

    fetch(`${API_URL}/category/create/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify({name})
    })
        .then(result => result.json())
        .then(result => {
            if(result.errors) {
                toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }else {
                dispatch({
                    type: "CREATE_CATS",
                    payload: result.msg
                });
                toastr.success(result.msg, 'Success', {"positionClass": "toast-bottom-left", timeOut: 10000});
                push('/'); 
            }
        })
        .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

}

export const getCategories = () => dispatch => {


    fetch(`${API_URL}/category`, {
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
                    type: "GET_CATS",
                    payload: { Msg: result.msg, Cats: result.data }
                });
            }
        })
        .catch(err => console.log(err) )

}

// You Can Add Icons For Edit && Delete and Consume Your API