import React from "react";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import UserInfos from "../UserInfos";
import OtherInfos from "../OtherInfos";
import UserBlogs from "../UserBlogs";

const Profile = () => {

    const { second } = useParams();
    const auth = useSelector(state => state.auth);


    return (
        <>
            <div className="container">
                <div className="row">

                    { auth.User?._id === second ? <UserInfos auth={auth} /> : <OtherInfos id={second} /> }

                    <UserBlogs userId={second} />

                </div>
            </div>
        </>
    )

}

export default Profile;