// dependencies
const crypto = require('crypto')
const environment = require('./environments')

// create hash password
exports.hash = (str) => {
    if(typeof str === 'string' && str.trim().length > 0) {
    const hash = crypto.createHmac('sha256', environment.secretKey)
               .update(str)
               .digest('hex');
    return hash
    } else {
        return false
    }
}