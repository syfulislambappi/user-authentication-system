// dependencies
const { update } = require('../handlers/dataHanlder')
const data = require('../handlers/dataHanlder')
const { hash } = require('../utils/hashPassword')
const { parseJSON } = require('../utils/parseJson')
const { verify } = require('../routes/tokenRoute')

// module scaffolding
const user = {}

// user route hanlder
user.userRoute = (requestProp, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete']
    if(acceptedMethods.indexOf(requestProp.method) > -1) {
        user._method[requestProp.method](requestProp, callback)
    } else {
        callback(400, {message: 'method not allowed'})
    }
}

// method module scaffolding
user._method = {}

// post route
user._method.post = (requestProp, callback) => {
    // check user data
    const Name = typeof requestProp.body.Name === 'string' && requestProp.body.Name.trim().length > 0 ? requestProp.body.Name : false
    const Email = typeof requestProp.body.Email === 'string' && requestProp.body.Email.trim().length > 0 ? requestProp.body.Email : false
    const Phone = typeof requestProp.body.Phone === 'string' && requestProp.body.Phone.trim().length === 11 ? requestProp.body.Phone : false
    const Password = typeof requestProp.body.Password === 'string' && requestProp.body.Password.trim().length > 0 ? requestProp.body.Password : false
    const Agree = typeof requestProp.body.Agree === 'boolean' ? requestProp.body.Agree : false

    // create user
    if(Name && Email && Phone && Password && Agree) {
        // check the user already exist
        data.read('users', Phone, (err, user) => {
            if(err) {
                const userObject = {
                    Name,
                    Email,
                    Phone,
                    Password: hash(Password),
                    Agree
                }
                data.create('users', Phone, userObject, err => {
                    if(!err && userObject) {
                        callback(200, {message: 'user created successfully'})
                    } else {
                        callback(500, {message: 'there is a server side error'})
                    }
                })
            } else {
                callback(500, {message:'there is a server side problem'})
            }
        })
    } else {
        callback(400, {message: 'you have a problem in your request'})
    }
}

// get route
user._method.get = (requestProp, callback) => {
    const Phone = typeof requestProp.queryObject.Phone === 'string' && requestProp.queryObject.Phone.trim().length === 11 ? requestProp.queryObject.Phone : false
    if(Phone) {
        const token = typeof requestProp.headersObject.token === 'string' ? requestProp.headersObject.token : false
        // authenticate user
    verify(token, Phone, (tokenValue) => {
        if(tokenValue) {
            data.read('users', Phone, (err, data) => {
                if(!err && data) {
                    const userObject = {...parseJSON(data)}
                    delete userObject.Password
                    callback(200, userObject)
                } else {
                    callback(400, {message: 'you have a problem in you request'})
                }
            })
        } else {
            callback(403, {message: 'Authentication failure'})
        }
    })
    } else {
        callback(404, {message: 'user is not found'})
    }
}

// put route
user._method.put = (requestProp, callback) => {
    // check the data
    const Name = typeof requestProp.body.Name === 'string' && requestProp.body.Name.trim().length > 0 ? requestProp.body.Name : false
    const Email = typeof requestProp.body.Email === 'string' && requestProp.body.Email.trim().length > 0 ? requestProp.body.Email : false
    const Phone = typeof requestProp.queryObject.Phone === 'string' && requestProp.queryObject.Phone.trim().length === 11 ? requestProp.queryObject.Phone : false
    const Password = typeof requestProp.body.Password === 'string' && requestProp.body.Password.trim().length > 0 ? requestProp.body.Password : false
    
    // update the data
    if(Phone) {
        if(Name || Email || Password) {
            const token = typeof requestProp.headersObject.token === 'string' ? requestProp.headersObject.token : false
        verify(token, Phone, (tokenValue) => {
            if(tokenValue) {
                data.read('users', Phone, (err, data) => {
                    const userData = {...parseJSON(data)}
                    if(!err && userData) {
                        if(Name) {
                            userData.Name = Name
                        }
                        if(Email) {
                            userData.Email = Email
                        }
                        if(Password) {
                            userData.Password = hash(Password)
                        }
                        update('users', Phone, userData, (err) => {
                            if(!err) {
                                callback(200, {message: 'user updated successfully'})
                            } else {
                                callback(500, {message: 'there was a server side problem'})
                            }
                        })
                    } else {
                        callback(400, {message: 'you have a problem in your request'})
                    }
                })
            } else {
                callback(403, {message: 'authentication failure'})
            }
        })
        } else {
            callback(400, {message: 'you have a problem in your request'})
        }
    } else {
        callback(400, {message: 'invalid phone number. try again later'})
    }
}

// delete route
user._method.delete = (requestProp, callback) => {
    const Phone = typeof requestProp.queryObject.Phone === 'string' && requestProp.queryObject.Phone.trim().length === 11 ? requestProp.queryObject.Phone : false
    if(Phone) {
        const token = typeof requestProp.headersObject.token === 'string' ? requestProp.headersObject.token : false
        verify(token, Phone, (tokenValue) => {
            if(tokenValue) {
                data.delete('users', Phone, (err) => {
                    if(!err) {
                        callback(200, {message: 'user delete succefully'})
                    } else {
                        callback(500, {message: 'there was a server side problem'})
                    }
                })
            } else {
                callback(403, {message: 'authentication failure'})
            }
        })
    } else {
        callback(404, {message: 'user not found'})
    }
}

// export route
module.exports = user