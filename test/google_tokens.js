const router = require("express").Router();
const spawn  = require("child_process").spawn;
const {get_google_auth_url, get_tokens} = require("../helpers/google_api");

const redirectURI = "auth/google";

router.get("/url", (req, res) => 
{
    spawn("open", [get_google_auth_url(redirectURI)]);
    res.json({msg: "check your browser"});
});

router.get("/", async (req, res) => 
{
    try
    {
        const {id_token, access_token, refresh_token} = 
                        await get_tokens(
                            req.query.code, 
                            process.env.MAIL_CLIENT_ID, 
                            process.env.MAIL_CLIENT_SECRET, 
                            `${process.env.SERVER_URL}/api/${redirectURI}`
                        );

        res.json({msg: "tokens retrieved !", data: {id_token, access_token, refresh_token}});
    }
    catch(err)
    {
        res.status(500).json({errors: err.message});
    }
});

module.exports = router;
