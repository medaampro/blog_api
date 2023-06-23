import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { API_URL } from '../../helpers/config';
import Loading from '../Loading';
import MyBlog from '../MyBlog';

const BlogDetails = () => {

    const { second } = useParams();
    const [blog, setBlog] = useState(undefined);
    const [error, setError] = useState(undefined);

    const socket = useSelector(state => state.socket);

    useEffect(() => {
        if(!second) return;

        fetch(`${API_URL}/blog/${second}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(result => result.json())
            .then(result => {
                if(result.errors) {
                    console.log(result.errors);
                    setError(result.errors);
                }else{
                    setBlog(result.data);
                }
            })
            .catch(err => {
                console.log(err);
                setError(err);
            }  )

        return () => setBlog(undefined);
    }, [second])

    useEffect(() => {
        if(!second || !socket) return;
        socket.emit('joinRoom', second);
    
        return () => {
            socket.emit('outRoom', second);
        }
    }, [socket, second])
      
    if(!blog && !error) return <Loading />

    return (
        <>
            {
                error && <h3>{ "Error" }</h3>
            }
            {
                blog && <MyBlog blog={ blog } />
            }
        </>
    )
}

export default BlogDetails;