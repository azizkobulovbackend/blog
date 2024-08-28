require('dotenv/config')

const {env} = process

const config = {
    port: +env.port,
    jwtSecretKey: env.JWT_SECRET_KEY,
}

module.exports = config