import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Actions/profile";
import Loading from "./Loading";

const OtherInfos = ({id}) => {

    const [myUser, setMyUser] = useState({});
    const { User } = useSelector(state => state.otherInfos);

    const dispatch = useDispatch();

    useEffect(() => {
        if(!id) return;
        if(User._id != id) {
            dispatch(getUser(id));
        }else {
            setMyUser(User);
        }
    }, [id, User, dispatch])


    if(!User._id) return <Loading />;


    return (
        
        <div className="col-4 col-md-4 col-lg-4">
            <h3>Other Infos</h3>
            <h5 className="text-uppercase text-danger">{myUser.role}</h5>
            <div>Name: <span className="text-info">{myUser.name}</span></div>
            <div>Join Date: <span style={{color: '#ffc107'}}>{ new Date(myUser.createdAt).toLocaleString() }</span></div>
        </div>
        
    )
}

export default OtherInfos;
