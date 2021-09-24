import { useEffect, useState } from "react";
import Com from "./Com";


const MyComment = ({comment}) => {

    const [showReply, setShowReply] = useState([]);
    const [next, setNext] = useState(1);

    useEffect( () => {
        if(!comment.replyCM) return;
        setShowReply(comment.replyCM);
    }, [comment.replyCM] )

    return (
        <Com comment={comment} showReply={showReply} setShowReply={setShowReply} type="comment" >

            {
                showReply.slice(0,next).map((rep, i) => <Com comment={rep} key={i} showReply={showReply} setShowReply={setShowReply} type="reply" />)
            }
            {
                showReply.length - next > 0 
                ? <small style={{ color: 'crimson', cursor: "pointer" }} onClick={() => setNext(next + 5)}>See more comments...</small>
                : showReply.length > 1 && <small style={{ color: 'teal', cursor: "pointer" }} onClick={() => setNext(1)}>Hide comments...</small>
            }

        </Com>
    )

}

export default MyComment;