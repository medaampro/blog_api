import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

const SocketClient = () => {

    const dispatch = useDispatch();
    const socket = useSelector(state => state.socket);


    useEffect(() => {

        if(!socket) return;
        socket.on('createComment', (data) => {
            dispatch({ type: "CREATE_COMMENT", payload: data })
        }); 
        return () => { socket.off('createComment') };

    }, [dispatch, socket])

    useEffect(() => {

        if(!socket) return;
        socket.on('replyComment', (data) => {
            dispatch({ type: "REPLY_COMMENT", payload: data })
        }); 
        return () => { socket.off('replyComment') };

    }, [dispatch, socket])


    return (
        <div>
            
        </div>
    )
}

export default SocketClient;