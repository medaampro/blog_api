import { useState } from "react";
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signUp } from '../Actions/auth';
import { API_URL } from '../helpers/config';
import { userValidator } from '../helpers/userValidator';
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const Signup = () => {

    const dispatch = useDispatch();
    const { location } = useHistory();
    
    let [name, setName] = useState('');
    let [account, setAccount] = useState('');
    let [password, setPassword] = useState('');
    let [confirmPassword, setConfirmPassword] = useState('');


    const submitData = e => {
        e.preventDefault();

        let check = userValidator({name, account, password, confirmPassword});

        if(check && check.length > 0) {
            check.map( err => toastr.warning(err, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000}) );
            return;
        }
        
        fetch(`${API_URL}/signup/`,{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({name, account, password})
        })
            .then(res => res.json())
            .then(result => {
                if(result.errors) {
                    toastr.warning(result.errors, 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }else{
                    dispatch( signUp({ Msg: result.msg }) );
                    toastr.success(result.msg, 'Welcome', {"positionClass": "toast-bottom-left", timeOut: 10000});
                }

            })
            .catch(err => toastr.error(err, 'Server Error', {"positionClass": "toast-bottom-left", timeOut: 10000}) )

    }
    
    return (

        <>
            <form onSubmit = { e => submitData(e) } className="my-5" >




                    <>

                        <div className="mb-3 row">
                            <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                            <div className="col-sm-10">
                                <input type="text" value = { name } className="form-control" id="inputName" onChange = { e => setName(e.target.value) } />
                            </div>
                        </div>

                        <div className="mb-3 row">
                            <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email / Phone</label>
                            <div className="col-sm-10">
                                <input type="email" value = { account } className="form-control" id="inputEmail" onChange = { e => setAccount(e.target.value) } />
                            </div>
                        </div>
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
                            <button className="btn btn-primary" type="submit" disabled= { (name && account && password && confirmPassword) ? false : true} >SignUp</button>
                        </div>

                    </>         


                    <small className="row my-2" >
                        <p className="mt-2" >
                            Already have account ? <Link to= {`/signin${location.search}`} >Sign In</Link>
                        </p>
                    </small>

            </form>
        </>

    )
    
}

export default Signup;