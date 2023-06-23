import React from "react";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import { API_URL } from '../helpers/config';
import { activeAccount } from "../Actions/auth";
import { useDispatch } from "react-redux";

const Active = () => {

    let { second } = useParams();
    // let { first, second } = useParams();
    const [actResult, setActresult] = useState("");

    const dispatch = useDispatch();

    useEffect(() => {

        if(second){
            
            fetch(`${API_URL}/active/`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({activeToken: second})
            })
                .then(res => res.json())
                .then(result => {
                    if(result.errors){
                        setActresult(result.errors);
                    }else {
                        setActresult(result.msg);
                        dispatch(activeAccount({Msg: result.msg}));
                    }

                } )
                .catch(err => setActresult(err) )
            }
            
        }, [dispatch, second]);




    return (
        <>
            {
                actResult && <h2>{ actResult }</h2>
            }
            
        </>
    )
}

export default Active;