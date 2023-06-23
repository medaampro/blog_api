// const twilio = require('twilio');

// const accountSid = `${process.env.accountSid}`;
// const authToken  = `${process.env.authToken}`;
// const twilioPhone = `${process.env.twilioPhone}`;
// const serviceID = `${process.env.serviceID}`; 
// const client = new twilio(accountSid, authToken);


// exports.SendSMS = (to, body, txt) => {

//     client.messages
//         .create({
//             body: `Blog App ${txt} - ${body}`,
//             to,
//             from: twilioPhone
//         })
//         .then((message) => console.log(message.sid));

// }

// exports.smsOTP = async (to, channel) => {
//     try {

//         const data = await client
//                             .verify
//                             .services(serviceID)
//                             .verifications
//                             .create({
//                                 to,
//                                 channel
//                             })
//         return data;

//     } catch (err) {
//         return null;
//     }
// }

// exports.smsVerification = async (to, code) => {
//     try {

//         const data = await client
//                             .verify
//                             .services(serviceID)
//                             .verificationChecks 
//                             .verifications
//                             .create({
//                                 to,
//                                 code
//                             })
//         return data;

//     } catch (err) {
//         return null;
//     }
// }