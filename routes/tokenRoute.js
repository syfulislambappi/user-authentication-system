// dependencies
const { create, update } = require('../handlers/dataHanlder')
const data = require('../handlers/dataHanlder')
const { hash } = require('../utils/hashPassword')
const { parseJSON } = require('../utils/parseJson')
const { tokenId } = require('../utils/tokenId')

// module scaffolding
const token = {}

// user route hanlder
token.tokenRoute = (requestProp, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.indexOf(requestProp.method) > -1) {
        token._method[requestProp.method](requestProp, callback)
    } else {
        callback(400, {message: 'method not allowed'})
    }
}

// method module scaffolding
token._method = {}

// post route
token._method.post = (requestProp, callback) => {
    const Phone = typeof requestProp.body.Phone === 'string' && requestProp.body.Phone.trim().length === 11 ? requestProp.body.Phone : false
    const Password = typeof requestProp.body.Password === 'string' && requestProp.body.Password.trim().length > 0 ? requestProp.body.Password : false
    
    // create token object
    if(Phone && Password) {
        data.read('users', Phone, (err, data) => {
            const hashedPassword = hash(Password)
            const userData = parseJSON(data)
            if(hashedPassword === userData.Password) {
                const Id = tokenId(20)
                const expires = Date.now() + 60 * 60 * 1000
                const tokenObject = {Id, Phone, expires};

                create('tokens', Id, tokenObject, (err) => {
                    if(!err) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {message: 'server side error'})
                    }
                })
            } else {
                callback(400, {message: 'invalid password'})
            }
        })
    } else {
        callback(400, {message: 'user not found in database'})
    }
}

// get route
token._method.get = (requestProp, callback) => {
    const Id = typeof requestProp.queryObject.Id === 'string' && requestProp.queryObject.Id.trim().length === 20 ? requestProp.queryObject.Id : false
    console.log(requestProp.queryObject.Id)
    if(Id) {
        data.read('tokens', Id, (err, data) => {
            if(!err && data) {
                const userObject = {...parseJSON(data)}
                callback(200, userObject)
            } else {
                callback(400, {message: 'tokens not found'})
            }
        })
    } else {
        callback(404, {message: 'token is not found'})
    }
}

// put route
token._method.put = (requestProp, callback) => {
    const Id = typeof requestProp.body.Id === 'string' && requestProp.body.Id.trim().length === 20 ? requestProp.body.Id : false
    const extend = typeof requestProp.body.extend === 'boolean' && requestProp.body.extend === true ? true : false

    if(Id && extend) {
        data.read('tokens', Id, (err, data) => {
            if(!err && data) {
                const tokendObject = parseJSON(data)
                if(tokendObject.expires > Date.now()) {
                    tokendObject.expires = Date.now() + 60 * 60 * 1000
                    update('tokens', Id, tokendObject, (err) => {
                        if(!err) {
                            callback(200, {message: 'token updated successfully'})
                        } else {
                            callback(500, {message: 'there is a problem in udpatig token'})
                        }
                    })
                } else {
                    callback(400, {message: 'token already expired'})
                }
            } else {
                callback(404, {message: 'token not found'})
            }
        })
    } else {
        callback(400, {message: 'you have a prbolem in your request'})
    }
}

// delete route
token._method.delete = (requestProp, callback) => {
    const Id = typeof requestProp.queryObject.Id === 'string' && requestProp.queryObject.Id.trim().length === 20 ? requestProp.queryObject.Id : false
    if(Id) {
        data.delete('tokens', Id, (err) => {
            if(!err) {
                callback(200, {message: 'token delete succefully'})
            } else {
                callback(500, {message: 'there was a server side problem'})
            }
        })
    } else {
        callback(404, {message: 'token not found'})
    }
}

// verify token
token.verify = (Id, Phone, callback) => {
    data.read('tokens', Id, (err, data) => {
        const tokenObject = parseJSON(data)
        if(!err && tokenObject) {
            if(tokenObject.Phone === Phone && tokenObject.expires > Date.now()) {
                callback(true)
            } else {
                callback(false)
            }
        } else {
            callback(false)
        }
    })
}

// export route
module.exports = token