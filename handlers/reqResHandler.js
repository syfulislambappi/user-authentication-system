// dependencies
const url = require('url')
const { StringDecoder } = require('string_decoder')
const routes = require('./routeHandler')
const { notFoundRoute } = require('../routes/notFoundRoute')
const { parseJSON } = require('../utils/parseJson')

// module scaffolding
const handler = {}

// handle request and response
handler.handleReqRes = (req, res) => {
    // request data
    const parsedUrl = url.parse(req.url, true)
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '')
    const queryObject = parsedUrl.query
    const headersObject = req.headers
    const method = req.method.toLowerCase()
    const requestProp = {parsedUrl, path, trimmedPath, queryObject, headersObject, method}

    // render the route
    const chosenHanlder = routes[trimmedPath] ? routes[trimmedPath] : notFoundRoute

    // request body data processing
    const decoder = new StringDecoder('utf-8')
    let bufferData = ''

    req.on('data', (chunk) => {
        bufferData += decoder.write(chunk)
    })
    
    req.on('end', () => {
        requestProp.body = parseJSON(bufferData)
        chosenHanlder(requestProp, (statusCode, payload) => {
            statusCode = typeof statusCode === 'number' ? statusCode : 500
            payload = typeof payload === 'object' ? payload : {}

            // convert payload to string
            const stringPayload = JSON.stringify(payload)

            // response processing
            res.setHeader('content-type', 'application/json')
            res.writeHead(statusCode)
            res.end(stringPayload)
        })
    })
}

// export hanlder
module.exports = handler