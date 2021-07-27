// dependencies
const http = require('http')
const { handleReqRes } = require('./handlers/reqResHandler')
const environment = require('./utils/environments')
const data = require('./handlers/dataHanlder')

// module scaffolding
const app = {}

// create server
app.server = () => {
    const server = http.createServer(app.handleReqRes)
    console.log(environment.envName)
    server.listen(environment.port, () => console.log(`server is running on port ${environment.port}`))
}

// request and response handler
app.handleReqRes = handleReqRes

// run the server
app.server()