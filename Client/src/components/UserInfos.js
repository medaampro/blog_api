

const UserInfos = ({auth}) => {



    return (
        
        <div className="col-4 col-md-4 col-lg-4">
            <h3>User Infos</h3>
            <p>
                name: {auth.User?.name}
                <br />
                <span style={{ fontSize: '10px', color: 'blue' }} > Create a Form to Update Profile </span> 
            </p>
        </div>
        
    )
}

export default UserInfos;