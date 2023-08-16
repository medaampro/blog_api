const axios       = require("axios");
const querystring = require("querystring");

function get_google_auth_url(redirectURI)
{
    const root_url = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = 
    {
        redirect_uri: `${process.env.SERVER_URL}/api/${redirectURI}`,
        client_id: process.env.MAIL_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
        ].join(" ")
    };

    return `${root_url}?${querystring.stringify(options)}`;
}

function get_tokens(code, client_id, client_secret, redirect_uri)
{
    const url    = "https://oauth2.googleapis.com/token";
    const values = {code, client_id, client_secret, redirect_uri, grant_type: "authorization_code"};

    return axios
            .post(url, querystring.stringify(values), {headers: {"Content-Type": "application/x-www-form-urlencoded"}})
            .then(res => res.data)
            .catch(error => {throw new Error(error.message)});
}

function get_user(id_token, access_token)
{
    const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;

    return axios
            .get(url, {headers: {Authorization: `Bearer ${id_token}`}})
            .then(res => res.data)
            .catch(error => {throw new Error(error.message)});
}

function refresh_tokens(client_id, client_secret, refresh_token)
{
    const url = "https://www.googleapis.com/oauth2/v4/token";
    const values = {client_id, client_secret, refresh_token, grant_type: "refresh_token"};

    return axios
            .post(url, querystring.stringify(values), {headers: {"Content-Type": "application/x-www-form-urlencoded"}})  
            .then(res => res.data)
            .catch(error => {throw new Error(error.message)});
}

module.exports = {get_google_auth_url, get_tokens, get_user, refresh_tokens};
