import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../Actions/auth';
import { API_URL } from '../helpers/config';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const ForgotPassword = () => {

    const [account, setAccount] = useState('');
    const dispatch = useDispatch();

    const submitData = e => {
        e.preventDefault();

        fetch(`${API_URL}/forgotPassword/`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({account})
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors) {
                    toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }else {
                    dispatch( forgotPassword({ Msg: result.msg }) );
                    toastr.success(result.msg , 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                    setAccount('');
                }
            })
            .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left"}) )

    }

    return (

        <form className="mb-3 row" onSubmit = { e => submitData(e) } >
            <label htmlFor="inputAccount" className="col-sm-2 col-form-label">Email / Phone</label>
            <div className="col-sm-10">
                <input type="text" value = { account } className="form-control" id="inputAccount" onChange = { e => setAccount(e.target.value) } />
            </div>
            <div className="col-12 text-center">
                <button className="btn btn-primary" type="submit" disabled= { account ? false : true} >Send</button>
            </div>
        </form>


    )
}

export default ForgotPassword;
