import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { passValidator } from "../../helpers/userValidator"; 
import { forgotPassword } from "../../Actions/auth";
import { API_URL } from "../../helpers/config";
import toastr from 'toastr';
import 'toastr/build/toastr.css';


const ForgotPassword = () => {

    const { second } = useParams();
    const { push } = useHistory();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const dispatch = useDispatch();

    const submitData = e => {
        e.preventDefault();

        let check = passValidator(password, confirmPassword);
        if(check && check.length > 0) {
            check.map( err => toastr.warning(err, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000}) );
            return;
        }

        if(!second) return;

        fetch(`${API_URL}/user/reset_password/`,{
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${second}`
            },
            body: JSON.stringify({password})
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors) {
                    toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }else {
                    dispatch( forgotPassword({ Msg: result.msg }) );
                    toastr.success(result.msg , 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                    setPassword('');
                    setConfirmPassword('');
                    push('/signin');
                }
            })
        .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )
    }

    return (        
        
        <form onSubmit = { e => submitData(e) } className="my-5" >

            <div className="mb-3 row">
                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                <div className="col-sm-10">
                    <input type="password" value = { password } className="form-control" id="inputPassword" onChange = { e => setPassword(e.target.value) } />
                </div>
            </div>
            <div className="mb-3 row">
                <label htmlFor="inputconfirmPassword" className="col-sm-2 col-form-label">Confirm Password</label>
                <div className="col-sm-10">
                    <input type="password" value = { confirmPassword } className="form-control" id="inputconfirmPassword" onChange = { e => setConfirmPassword(e.target.value) } />
                </div>
            </div>

            <div className="col-12 text-center">
                <button className="btn btn-primary" type="submit" disabled= { (password && confirmPassword) ? false : true} >Reset Password</button>
            </div>

        </form>

    )
}

export default ForgotPassword;



