const jwt = require("jsonwebtoken");

exports.generate_active_token  = payload => jwt.sign({data: payload}, `${process.env.ACTIVE_TOKEN_SECRET}`, {expiresIn: `5m`});
exports.verify_active_token    = payload => jwt.verify(payload, `${process.env.ACTIVE_TOKEN_SECRET}`);

exports.generate_access_token  = payload => jwt.sign({data: payload}, `${process.env.ACCESS_TOKEN_SECRET}`, {expiresIn: `15m`});
exports.verify_access_token    = payload => jwt.verify(payload, `${process.env.ACCESS_TOKEN_SECRET}`);

exports.generate_refresh_token = payload => jwt.sign({data: payload}, `${process.env.REFRESH_TOKEN_SECRET}`, {expiresIn: `30d`});
exports.verify_refresh_token   = payload => jwt.verify(payload, `${process.env.REFRESH_TOKEN_SECRET}`);
