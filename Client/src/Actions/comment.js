import { API_URL } from '../helpers/config';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { checkExpToken } from '../helpers/checkExpToken';


export const getComments = (id, search) => dispatch => {

    let limit = 20;
    let value = search ? search : `?page=${1}`;  

    fetch(`${API_URL}/comment/comments/${id}${value}&limit=${limit}`, {
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
                    type: "GET_COMMENTS",
                    payload: { Msg: result.msg, data: result.data, Total: result.total, Search: value  }
                });
            }
        })
        .catch(err => console.log(err) )

}


export const createComment = (comment, token) => async (dispatch) => {

    const access_token = await checkExpToken(token, dispatch);
    token = access_token ? access_token : token;

    fetch(`${API_URL}/comment/create/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(comment)
    })
        .then(result => result.json())
        .then(result => {
            if(result.errors) {
                toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }else{
                // dispatch({
                //     type: "CREATE_COMMENT",
                //     payload: { Msg: result.msg, Comment: {...result.Comment, user: comment.user}  }
                // });
                toastr.success(result.msg, 'Success', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }
        })
        .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

}


export const replyComment = (reply, token) => async (dispatch) => {

    const access_token = await checkExpToken(token, dispatch);
    token = access_token ? access_token : token;

    fetch(`${API_URL}/comment/reply_comment`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(reply)
    })
        .then(result => result.json())
        .then(result => {
            if(result.errors) {
                toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }else{
                // dispatch({
                //     type: "REPLY_COMMENT",
                //     payload: { Msg: result.msg, Comment: {...result.Comment, user: reply.user, reply_user: reply.reply_user}  }
                // });
                toastr.success(result.msg, 'Success', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }
        })
        .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

}


// Update && Delete : Mol Lblog mn 7e9o idir gha delete mol comment kolchi Update Comment o Reply f d9a