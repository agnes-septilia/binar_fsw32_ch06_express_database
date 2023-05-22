// import modules
const express = require('express');
const fs = require('fs');


// define PORT 
const PORT = process.env.PORT

// create server
const app = express()


// assign static folders
app.use(express.static(__dirname + '/assets'))
app.use(express.static(__dirname + '/css_stylesheet'))
app.use(express.static(__dirname + '/js_script'))

app.set('view engine', 'ejs')

// activate log file using Application Middleware
const logger = require(__dirname + '/js_script/logger_file')
app.use(logger)


// Built-in Middleware to get the result from input
app.use(express.urlencoded({ extended: false}))  


// === Routing Middleware
// Routing for Landing Pages
const mainRouter = require('./router/main_routing');
app.use(mainRouter)
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/html_code/index.html')
})

// Routing for The Games subpages
const gamesRouter = require('./router/games_routing');
app.use(gamesRouter)


// Routing for Userdata pages
const signupRouter = require('./router/signup_routing');
app.use(signupRouter)
const loginRouter = require('./router/login_routing');
app.use(loginRouter)
const adminRouter = require('./router/admin_routing');
app.use(adminRouter)


// Error Handling, with and without middleware
app.use(function(error, req, res, next) {
    console.log(error);
    res.status(500).json({status: 'failed', message: error.message})
})

app.get('*', function(req, res) {
    res.status(404).json({status: 404, message: "page not found!"})
})


// Start the server
app.listen(PORT, () => {
console.log(`App listening on port ${PORT}`);
});

