//  TokenGeneration
const jwt = require('jsonwebtoken');

exports.generateActiveToken = payload => jwt.sign({data: payload}, `${process.env.Active_Token_Secret}` , { expiresIn: `5m` });
exports.generateAccessToken = payload => jwt.sign({data: payload}, `${process.env.Access_Token_Secret}` , { expiresIn: `15m` });
exports.generateRefreshToken = payload => jwt.sign({data: payload}, `${process.env.Refresh_Token_Secret}` , { expiresIn: `30d` });


exports.verifyActiveToken = payload => jwt.verify(payload, `${process.env.Active_Token_Secret}`);
exports.verifyAccessToken = payload => jwt.verify(payload, `${process.env.Access_Token_Secret}`);
exports.verifyRefreshToken = payload => jwt.verify(payload, `${process.env.Refresh_Token_Secret}`);