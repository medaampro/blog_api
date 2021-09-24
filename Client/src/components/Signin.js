import { useEffect, useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signUp, signIn } from '../Actions/auth';
import { API_URL } from '../helpers/config';
import { validatePhone } from '../helpers/userValidator';
import toastr from 'toastr';
import 'toastr/build/toastr.css';
import { GoogleLogin } from 'react-google-login-lite';
import { FacebookLogin } from 'react-facebook-login-lite';



const Signin = () => {

    const dispatch = useDispatch();
    const { push, location } = useHistory();

    const auth = useSelector(state => state.auth);
    
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [sms, setSms] = useState('');
    let [phone, setPhone] = useState('');

    useEffect(() => {
        if(auth.Token) {
            let url = location.search.replace('?', '/');
            return push(url);
        }
    }, [auth.Token, useHistory()]);

    const submitData = e => {
        e.preventDefault();

        if(phone && sms) {
            
            const check = validatePhone(phone);
            if(!check) {
                toastr.warning("Invalid Phone", 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }else {
                fetch(`${API_URL}/smsSignIn/`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({account: phone})
                })
                    .then(resa => resa.json())
                    .then(resulta => {
                        if(!resulta.data.valid) {
                            const code = prompt("Enter Your Code");
                            if(!code) return;

                            fetch(`${API_URL}/smsVerify/`,{
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                credentials: 'include',
                                body: JSON.stringify({account: phone, code})
                            })
                                .then(res => res.json())
                                .then(result => {
                                    if(result.errors) {
                                        toastr.warning(result.errors, 'Error SignIn !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                                    }else if(result.msg) {
                                        if(result.msg === "SignIn Success !") {
                                            dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                                            toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                                            push('/');
                                        }else if(result.msg === "SignUp Success, You Are Connected Now !!") {
                                            dispatch( signUp({ Msg: result.msg }) );
                                            dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                                            toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                                            push('/');
                                        }
                                    }
                                })
                                .catch(error => console.error(error) )

                        }
                    })
                    .catch(err => console.error(err) )
            }

        }else if(email && !sms) {

            fetch(`${API_URL}/signin/`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({account: email, password})
            })
                .then(res => res.json())
                .then(result => {
                    if(result.errors) {
                        toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                    }else{
                        dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                        toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                        push('/');
                    }
                })
                .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

        }


    }


    const onSuccess = (googleUser) => {

        const { id_token } = googleUser.getAuthResponse();

        fetch(`${API_URL}/googleSignIn/`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({id_token})
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors) {
                    toastr.warning(result.errors, 'Error SignIn !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }else if(result.msg) {
                    if(result.msg === "SignIn Success !") {
                        dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                        toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                        push('/');
                    }else if(result.msg === "SignUp Success, You Are Connected Now !!") {
                        dispatch( signUp({ Msg: result.msg }) );
                        dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                        toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                        push('/');
                    }
                }
            })
            .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}))

    };


    const onFBSuccess = (response) => {

        const { accessToken, userID } = response.authResponse;
        const URL = `https://graph.facebook.com/v3.0/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`;
        // decrypte Token and Send Data Normally In Backend But ...
        fetch(URL)
            .then(ress => ress.json())
            .then(data => {

                fetch(`${API_URL}/facebookSignIn/`,{
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ data })
                })
                    .then(res => res.json())
                    .then(result => {
                        if(result.errors) {
                            toastr.warning(result.errors, 'Error SignIn !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                        }else if(result.msg) {
                            if(result.msg === "SignIn Success !") {
                                dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                                toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                                push('/');
                            }else if(result.msg === "SignUp Success, You Are Connected Now !!") {
                                dispatch( signUp({ Msg: result.msg }) );
                                dispatch( signIn({ Msg: result.msg , User: { _id: result.User._id, name: result.User.name, role: result.User.role } , Token: result.AccessToken }) );
                                toastr.success('Authenticated Successfully', 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                                push('/');
                            }
                        }
                    })
                    .catch(err => console.error(err))

            })
            .catch(err => console.log(err))

    };
      

    const onFailure = err => console.log(err);

      
    
    return (

        <>
            <form onSubmit = { e => submitData(e) } className="my-5" >

                        <GoogleLogin 
                            client_id= "409597292301-nr7e1i8h4bc3q50jjhrg0ucofppdsqf9.apps.googleusercontent.com"
                            cookiepolicy='single_host_origin'
                            onSuccess={onSuccess}
                            onFailure={onFailure}
                        />
                        <FacebookLogin 
                            appId="1542451019432656"
                            onSuccess={onFBSuccess}
                            onFailure={onFailure}
                        />

                { sms && (
                    <>
                    
                        <div className="mb-3 row">
                            <label htmlFor="inputPhone" className="col-sm-2 col-form-label">Phone</label>
                            <div className="col-sm-10">
                                <input type="tel" value = { phone } placeholder="+2126********" className="form-control" id="inputPhone" onChange = { e => setPhone(e.target.value) } />
                            </div>
                        </div>

                        <div className="col-12 text-center">
                            <button className="btn btn-primary" type="submit" disabled= { phone ? false : true} >SignIn</button>
                        </div>

                    </>
                ) }

                { !sms && (
                    <>

                        <div className="mb-3 row">
                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email / Phone</label>
                            <div className="col-sm-10">
                                <input type="email" value = { email } className="form-control" id="inputEmail" onChange = { e => setEmail(e.target.value) } />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                            <div className="col-sm-10">
                                <input type="password" value = { password } className="form-control" id="inputPassword" onChange = { e => setPassword(e.target.value) } />
                            </div>
                        </div>

                        <div className="col-12 text-center">
                            <button className="btn btn-primary" type="submit" disabled= { (email && password) ? false : true} >SignIn</button>
                        </div>

                    </>         
                ) }

                <small className="row my-2" >
                    <span className="col-6">
                        <Link className="col-6" to="/forgotPassword">Forgot Password</Link> 
                    </span>
                    <span className="col-6 text-end" style={{cursor: 'pointer', color: 'blue'}} onClick={ () => setSms(!sms) } >
                        { sms ? 'SignIn With Password' : 'SignIn With SMS' }
                    </span>
                    <p className="mt-2" >
                        You don't have account ? <Link to= {`/signup${location.search}`}>Sign Up</Link>
                    </p>
                </small>

            </form>
        </>

    )
    
}

export default Signin;