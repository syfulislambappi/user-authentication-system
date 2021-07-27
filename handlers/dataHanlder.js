// dependencies
const fs = require('fs')
const path = require('path')

// module scaffolding
const data = {}

// base directory
const basedir = path.join(__dirname,'../.data/')

// create data
data.create = (dir, file, data, callback) => {
    // open file
    fs.open(basedir+dir+"/"+file+'.json', 'wx', (err, fd) => {
        if(!err && fd) {
            // conver buffer data string
            const stringData = JSON.stringify(data)
            fs.writeFile(fd, stringData, err => {
                if(!err && stringData) {
                    fs.close(fd, err => {
                        if(!err && fd) {
                            callback(false)
                        } else {
                            callback('there is a problem in closing file')
                        }
                    })
                } else {
                    callback('there is a problem in creating user')
                }
            })
        } else {
            callback('user is already existed')
        }
    })
}

// read data
data.read = (dir, file, callback) => {
    fs.readFile(basedir+dir+"/"+file+'.json', 'utf-8', (err, data) => {
        if(!err && data) {
            callback(err, data)
        } else {
            callback('file is not existed')
        }
    })
}

// update data
data.update = (dir, file, data, callback) => {
    // open the existing file
    fs.open(basedir+dir+"/"+file+'.json', 'r+', (err, fd) => {
        if(!err && fd) {
            // convert buffer data from string data
            const stringData = JSON.stringify(data)

            // clear the file
            fs.ftruncate(fd, err => {
                if(!err) {
                    // update the file
                    fs.writeFile(fd, stringData, err => {
                        if(!err && stringData) {
                            callback(false)
                        } else {
                            callback('there is a problem in updating file')
                        }
                    })
                } else {
                    callback('there is a problem in clear the user data')
                }
            })
        } else {
            callback('user doesn\'t existed')
        }
    })
}

// delete data
data.delete = (dir, file, callback) => {
    fs.unlink(basedir+dir+"/"+file+'.json', err => {
        if(!err) {
            callback(false)
        } else {
            callback('file doesn\'t existed')
        }
    })
}

// export the data
module.exports = data