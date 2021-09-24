import { API_URL } from '../helpers/config';
import { imageValidator } from '../helpers/imageValidator';
import { imageUpload } from '../helpers/imageUpload';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { checkExpToken } from '../helpers/checkExpToken';


export const createBlog = (blog, token, push) => async (dispatch) => {

    const access_token = await checkExpToken(token, dispatch);
    token = access_token ? access_token : token;

    let url;
    if(typeof(blog.thumbnail) !== 'string') {

        let check = imageValidator(blog.thumbnail);
        if(check) return console.log('Size Of Image is More than 1Mb !!');

        const photo = await imageUpload(blog.thumbnail);
        url = photo.url;

    }else {
        url = blog.thumbnail;
    }

    const newBlog = {...blog, thumbnail: url};

    fetch(`${API_URL}/blog/create/`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        },
        body: JSON.stringify(newBlog)
    })
        .then(result => result.json())
        .then(result => {
            if(result.errors) {
                toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }else{
                dispatch({
                    type: "CREATE_BLOG",
                    payload: result.msg
                });
                toastr.success(result.msg, 'Success', {"positionClass": "toast-bottom-left", timeOut: 10000});
                push('/');
            }
        })
        .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

}


export const getBlogs = () => (dispatch) => {

    fetch(`${API_URL}/blog`, {
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
                    type: "GET_BLOGS",
                    payload: { Msg: result.msg, Blogs: result.data }
                });
            }
        })
        .catch(err => console.log(err) )

}


export const getBlogsByCategoryId = (id, search) => (dispatch) => {

    let limit = 1;
    let value = search ? search : `?page=${1}`;  

    fetch(`${API_URL}/blog/category/${id}${value}&limit=${limit}`, {
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
                    type: "GET_BLOGS_BY_CAT",
                    payload: { Msg: result.msg, Blogs: result.data.blogs, Total: result.data.total, Id: id, Search: search } 
                });
            }
        })
        .catch(err => console.log(err) )

}


export const getBlogsByUserId = (id, search) => (dispatch) => {

    let limit = 2;
    let value = search ? search : `?page=${1}`;  

    fetch(`${API_URL}/blog/user/${id}${value}&limit=${limit}`, {
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
                    type: "GET_BLOGS_BY_USER_ID",
                    payload: { Msg: result.msg, Blogs: result.data.blogs, Total: result.data.total, Id: id, Search: search }
                });
            }
        })
        .catch(err => console.log(err) )

}