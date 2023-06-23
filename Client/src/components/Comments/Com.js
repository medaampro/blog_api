import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { replyComment } from "../../Actions/comment";
import Input from "./Input";

const Com = ({children, comment, showReply, setShowReply, type}) => {

    const [showInput, setShowInput] = useState(false);

    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();

    const handleResponse = body => {

        if(!auth.Token) return;

        const data = {
            user: auth.User,
            blog_id: comment.blog_id,
            blog_user_id: comment. blog_user_id,
            content: body,
            comment_root: comment._id || comment.comment_root,
            reply_user: comment.user,
            createdAt: new Date().toISOString()
        }
        
        setShowReply([...showReply, data]);
        dispatch(replyComment(data, auth.Token));
        setShowInput(false);

    }

    return (

        <div>

            {/* Comment */}
            <div className="my-3 d-flex" style={{ opacity: comment?._id ? 1 : 0.5, pointerEvents: comment?._id ? "initial" : "none" }} >

                <div style={{width: "100px", padding: "5px"}} >
                    <small className="d-block text-break">
                        <Link to={`/profile/${comment.user._id}`}>
                            {comment.user.role !== "admin" ? comment.user.name : "Admin"}
                        </Link>
                    </small>
                </div>

                <div className="w-100" style={{ border: "1px solid" }} >
                    <div>
                        <div className="p-2" dangerouslySetInnerHTML={{
                        __html: comment.content
                        }} />

                        <div className="d-flex justify-content-between p-2">
                            
                            {
                                type === "comment" &&  
                                <small style={{cursor: 'pointer'}} onClick={ () => setShowInput(!showInput) } >
                                    { showInput ? "- Cancel -" : "- Reply -" } 
                                </small>
                            }



                                <small>
                                    { new Date(comment.createdAt).toLocaleString() }
                                </small>

                        </div>
                    </div>                
                </div>

            </div>

            {/* InputToReply */}
            <div style={{ marginLeft: "100px" }} >
                {
                    showInput && <Input callback={ handleResponse } />
                }
            </div>

            {/* Reply */}
            <div style={{ marginLeft: "10%" , width: "90%" }} >
                { children }
            </div>

        </div>    
        
    )
}

export default Com;