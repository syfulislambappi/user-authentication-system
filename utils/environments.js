// module scaffolding
const environment = {}

// development environment
environment.development = {
    port: 8080,
    envName: 'development',
    secretKey: 'gslahflrhfga'
}

// production environment
environment.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'ghfjlghkdflghfkjgk'
}

// check the enivronment
const checkEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'development'

// environment to export
const environtToExport = typeof environment[checkEnvironment] === 'object' ? environment[checkEnvironment] : environment.development

// export environment
module.exports = environtToExport