// dependencies
const { userRoute } = require('../routes/userRoute')
const { tokenRoute } = require('../routes/tokenRoute')

// routes hanlder
const routes = {
    'user': userRoute,
    'token': tokenRoute
}

// export routes
module.exports = routes