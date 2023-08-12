function validate_username(username) 
{
    if(!username)
        return {status: 0, msg: "username is required !!"};

    if(username.length > 20)
        return {status: 0, msg: "username should be less than 20 chars !!"};

    return {status: 1, msg: "valid username !!"};
}

function validate_email(email) 
{
    if(!email)
        return {status: 0, msg: "email is required !!"};

    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!pattern.test(String(email).toLowerCase()))
        return {status: 0, msg: "invalid email !!"};

    return {status: 1, msg: "valid email !!"};
}

function validate_password(password) 
{
    if(!password)
        return {status: 0, msg: "password is required !!"};

    if(password.length < 6)
        return {status: 0, msg: "password should be more than 5 chars !!"};

    return {status: 1, msg: "valid password !!"};
}

module.exports = {validate_username, validate_email, validate_password};
