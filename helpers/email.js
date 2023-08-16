const nodemailer = require("nodemailer");

function send_email(receiver_email, url, text)
{
    const transport = nodemailer.createTransport(
    {
        host: "smtp.gmail.com",
        service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: `${process.env.SENDER_EMAIL}`,
            pass: `${process.env.SENDER_PASSWORD}`
        }
    });

    const mailOptions = 
    {
        from: `${process.env.SENDER_EMAIl}`,
        to: receiver_email,
        subject: "blog api",
        html: 
        `
            <h3>${text}</h3> 
            <p>${url} </p> 
        `
    };

    return transport.sendMail(mailOptions)
            .then(res => res)
            .catch(error => {throw new Error(error.message)});
}

module.exports = {send_email};
