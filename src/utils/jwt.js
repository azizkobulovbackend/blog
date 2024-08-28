const {sign, verify} = require("jsonwebtoken");
const config = require("../../config")

const secret = config.jwtSecretKey;

const createToken = (payload) =>
  sign(payload, secret, {expiresIn: '1h'});

const checkToken = (payload, callback) => verify(payload, secret, callback);

module.exports = {
  createToken,
  checkToken,
};
