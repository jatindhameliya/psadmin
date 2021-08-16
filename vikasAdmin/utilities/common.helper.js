let CryptoJS = require('crypto-js');
let jwt = require('jsonwebtoken');
const response = require('./response.manager');
function generateAccessToken(userData) {
	return jwt.sign(userData, process.env.LOGIN_AUTH_TOKEN, { expiresIn: process.env.LOGIN_EXP_IN_DAYS + 'd' });
}
function authenticateToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const token = bearer[1];
		jwt.verify(token, process.env.LOGIN_AUTH_TOKEN, (err, auth) => {
			if (err) {
				return response.unauthorisedRequest(res);
			} else {
				req.token = auth;
			}
		});
		next();
	} else {
		return response.unauthorisedRequest(res);
	}
}
module.exports = { generateAccessToken, authenticateToken };
