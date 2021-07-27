// module scaffolding
const handler = {}

// not found hanlder
handler.notFoundRoute = (requestProp, callback) => {
    callback(404, {message: '404 page not found'})
}

// export not found route
module.exports = handler