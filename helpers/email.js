const nodemailer       = require("nodemailer");
const {OAuth2Client}   = require("google-auth-library");
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

async function send_email(receiver_email, url, text)
{
    const oAuth2Client = new OAuth2Client(`${process.env.MAIL_CLIENT_ID}`, `${process.env.MAIL_CLIENT_SECRET}`, OAUTH_PLAYGROUND);
    oAuth2Client.setCredentials({refresh_token: `${process.env.MAIL_REFRESH_TOKEN}`});

    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport(
    {
        service: "gmail",
        auth: 
        {
            type: "oauth2",
            user: `${process.env.SENDER_EMAIL_ADDRESS}`,
            clientId: `${process.env.MAIL_CLIENT_ID}`,
            clientSecret: `${process.env.MAIL_CLIENT_SECRET}`,
            refreshToken: `${process.env.MAIL_REFRESH_TOKEN}`,
            accessToken: access_token
        }
    });

    const mailOptions = 
    {
        from: `${process.env.SENDER_EMAIL}`,
        to: receiver_email,
        subject: "Blog app",
        html: 
        `
            <h3>${text}</h3> 
            <p>${url} </p> 
        `
    };

    const result = await transport.sendMail(mailOptions);

    return result;
}

module.exports = {send_email};
