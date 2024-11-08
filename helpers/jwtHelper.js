const JWT = require('jsonwebtoken')
const { COOKIES: { ACCESS_TOKEN_KEY } } = require('../common/constants');
const ErrorHandler = require('../common/errors/errorHandler');

module.exports.signAccessToken = (user) => {
	return new Promise((resolve, reject) => {
		const payload = {
			loggedInUserID: user.userId,
			loggedInUsername: user.username,
			loggedInEmail: user.email,
			loggedInRole: user.role,
		};
		const secret = process.env.ACCESS_TOKEN_SECRET;
		const options = {
			expiresIn: '1y',
			issuer: 'portfolioapp.com',
			audience: user.userId,
		}
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				console.log('Error = ', err.message);
				reject(new ErrorHandler(500, 'Internal Server Error.'));
				return;
			}
			resolve(token);
		})
	})
};

module.exports.verifyAccessToken = (req, res, next) => {
	console.log('req.headers = ');
	console.log(req.headers);
	console.log('req.cookies = ', ACCESS_TOKEN_KEY);
	console.log(req.cookies);
	let token = null;
	// console.log(Buffer.from(req.cookies['access-token'], 'base64').toString('ascii'));
	if (req.cookies && req.cookies[ACCESS_TOKEN_KEY]) {
		token = req.cookies[ACCESS_TOKEN_KEY]
	} else if (!req.headers['authorization']) return next(new Error('Unauthorized Error.'));
	else if (req.headers['authorization']) {
		const authHeader = req.headers['authorization']
		const bearerToken = authHeader?.split(' ')
		token = bearerToken && bearerToken[1]
	}
	JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
		console.log('Payload = ', payload);
		if (err) {
			console.log('Error = ', err);
			const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
			console.log('Error message = ', message);
			return next(new ErrorHandler(401, 'Unauthorized Error'));
		}
		req.user = payload
		next()
	})
};

module.exports.signRefreshToken = (userId) => {
	return new Promise((resolve, reject) => {
		const payload = {
			userId: user.userId,
		};
		const secret = process.env.REFRESH_TOKEN_SECRET
		const options = {
			expiresIn: '1y',
			issuer: 'mymcaapp.com',
			audience: userId,
		}
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				console.log('Error = ', err.message)
				reject(new ErrorHandler(500, 'Internal Server Error.'));
			}
			resolve(token)
		})
	})
};

module.exports.verifyRefreshToken = (refreshToken) => {
	return new Promise((resolve, reject) => {
		JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
			if (err) return reject(new ErrorHandler(401, 'Unauthorized Error.'));
			console.log('Payload = ', JSON.stringify(payload, null, 2));
			const userId = payload.aud
			return resolve(userId);
		})
	})
};

module.exports.generateToken = (user, expires = '15m') => {
	return new Promise((resolve, reject) => {
		const payload = {
			loggedInUserID: user.userId,
		};
		const secret = process.env.GENERATE_TOKEN_SECRET + user.password;
		const options = {
			expiresIn: expires,
			issuer: 'portfolioapp.com',
			audience: user.userId,
		}
		JWT.sign(payload, secret, options, (err, token) => {
			if (err) {
				console.log('Error = ', err.message);
				reject(new ErrorHandler(500, 'Internal Server Error.'));
				return;
			}
			resolve(token);
		})
	})
};

module.exports.verifyToken = (token, userSecret) => {
	console.log('token = ');
	console.log(token);
	console.log('userSecret: ');
	console.log(userSecret);
	let verifyData;
	JWT.verify(token, process.env.GENERATE_TOKEN_SECRET + userSecret, (err, payload) => {
		console.log('Payload = ', payload);
		if (err) {
			console.log('Error = ', err);
			const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
			console.log('Error message = ', message);
			throw new ErrorHandler(401, 'Unauthorized Error');
		}
		verifyData = payload;
	})
	return verifyData;
};