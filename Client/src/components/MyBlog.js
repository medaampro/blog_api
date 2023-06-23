import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";

import Input from "./Comments/Input";
import MyComment from "./Comments/MyComment";
import Loading from "./Loading";
import Pagination from "./Pagination";

import { getComments, createComment } from "../Actions/comment";


const MyBlog = ({blog}) => {

    const { auth, comments } = useSelector(state => state); 
    const dispatch = useDispatch();

    const history = useHistory();
    const { search } = history.location;

    const [loading, setLoading] = useState(false);
    const [showComments, setShowComments] = useState([]);


    useEffect( () => {
        if(!blog._id) return;
        setLoading(false);
        dispatch(getComments(blog._id, search));
        if(comments.Search) history.push(comments.Search);
        setLoading(true);
    }, [dispatch, blog._id, history] )

    useEffect( () => {
        setShowComments(comments.data);
    }, [comments.data] )

    const handleComment = body => {
        
        if(!auth.Token) return;

        const comment = {
            user: auth.User,
            content: body,
            blog_id: blog._id,
            blog_user_id: blog.user._id,
            createdAt: new Date().toISOString()

        }
        setShowComments([comment, ...showComments])
        dispatch(createComment(comment, auth.Token));

    }

    const handlePagination = num => {
        const search = `?page=${num}`;
        dispatch(getComments(blog._id, search));
    }


    return (

        <div style={{width: "100%", overflow: "break" }} >
            <h2 className="text-center my-3 text-capitalize fs-1" style={{ color: '#ff7a00' }}>
                {blog.title}
            </h2>

            {/* Blog */}
            <div className="text-end fst-italic" style={{color: 'teal'}}>
                <small>
                {
                    typeof(blog.user) !== 'string' &&
                    `By: ${blog.user.name}`
                }
                </small>

                <small className="ms-2">
                { new Date(blog.createdAt).toLocaleString() }
                </small>
            </div>


            
            {/* Comments */}
            <>
                <hr className="my-1" />
                <h3 style={{color: '#ff7a00'}}>✩ Comments ✩</h3>

                <div dangerouslySetInnerHTML={{
                    __html: blog.content
                }} />
                
                {/* Input */}
                {
                    auth.Token ? <Input callback={ handleComment } /> : <h5>Please <Link to={`/signin?blog/${blog._id}`}>Signin</Link> to comment.</h5>
                }
                
                {/* Comments List */}
                {
                    !loading ? <Loading /> : 
                    showComments?.map((comment, index) => <MyComment key={index} comment={ comment } />)
                }

                {/* Total Comments */}
                {
                    comments.Total > 1 && <Pagination total={comments.Total} callback={ handlePagination }/>
                }
                
            </>

        </div>

    )
}

export default MyBlog;