const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

//  Send Mails

exports.sendEmail = async (to, url, txt) => {

    const oAuth2Client = new OAuth2Client(`${process.env.Client_Id}`, `${process.env.Client_Secret}`, OAUTH_PLAYGROUND);
    oAuth2Client.setCredentials({refresh_token: `${process.env.Refresh_Token}`});
    const access_token = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "oauth2",
            user: `${process.env.Sender_Email}`,
            clientId: `${process.env.Client_Id}`,
            clientSecret: `${process.env.Client_Secret}`,
            refreshToken: `${process.env.Refresh_Token}`,
            accessToken: access_token
        }
    })
    const mailOptions = {
        from: `${process.env.Sender_Email}`,
        to: to,
        subject: "Blog App",
        html: 
            `
                <h3> ${txt} </h3> 
                <p> hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh Clicki Clicki 3la ${url} </p> 
            `
    }
    const result = await transport.sendMail(mailOptions);
    return result;
    
}