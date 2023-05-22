//// SCRIPT TO CREATE LOGGER FILE ////

/* using Application Middleware, we will capture the log history of user
The data will be fetched on the logger.txt file
*/


// import modules
const fs = require('fs');
const {resolve} = require('path');

// create file path
const filePath = resolve("logger.txt"); 


// function to run the logger
function logger(req, res, next) {
    req.requestTime = new Date();
    const logDetail = `${req.requestTime.toISOString()} ${req.method} ${req.url}`
    return logDetail
}


// function to append data per row to file
function appendData(data) {
    fs.appendFileSync(filePath, "\n" + data, function err() {
        if (err) {
            throw err
        }
    })
}


// function to access and activate the file 
function accessLogFile (req, res, next) {
    const data = logger(req, res, next)
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, data)
    } else {
        appendData(data)
    }
    next()
}

// export module
module.exports = accessLogFile

