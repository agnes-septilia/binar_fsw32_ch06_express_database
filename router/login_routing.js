// ROUTER MIDDLEWARE FOR REGISTRATION PAGES

/* WORKFLOW
1. Data from login page will go through verification process as in login_script.js
2. After user finish login, they will go to welcome page, where they can either go back to homepage or play the game.
3. If user is superadmin, they will go to admin dashboard
*/


// import modules
const express = require('express');
const fs = require('fs')
const {resolve} = require('path');
const formidable = require('formidable')
const CryptoJS = require ("crypto-js");

// activate router
const Router = express.Router();

// get modules from files
const filePath = resolve()
const loginModule = require(filePath + '/js_script/login_script')


// use Built-In Middleware to work with url data
Router.use(express.urlencoded({ extended: false}))


// connect with database
const postgresqlDB = require(filePath + '/db/postgresql')

// function to send image file as url link --> will be used to show image on welcome page
function takeImagefromURL(filePath) {
    Router.get('/image', function(req, res) {
        const streamReadFile = fs.createReadStream(filePath)
        streamReadFile.pipe(res)
    })
}


// === ROUTING for welcome page if customer succeed login 
Router.post('/welcome-page', async function(req, res) { 
    try {
        const form = formidable({ multiples: true})
        
        form.parse(req, async (err, fields, files) => {
            // get input from user
            const loginEmail = fields.email 
            const loginPassword = CryptoJS.HmacSHA256(fields.password, `${process.env.PASSKEY}`).toString()

            // if user is superadmin, can skip the encryption and go to superadmin page
            if (loginEmail === process.env.SUPERADMIN_EMAIL && fields.password === process.env.SUPERADMIN_PASSWORD) {
                res.sendFile(filePath + '/html_code/admin_page.html')
            } 
            else {

                // take User data from database
                const userdataRaw = await postgresqlDB.client.query(loginModule.getUserdata(loginEmail))
                const dbEmail = userdataRaw.rows[0].email
                const dbPassword = userdataRaw.rows[0].password

                // check user validity
                const validUser = loginModule.loginAuth(loginEmail, loginPassword, dbEmail, dbPassword)

                // if email and password match, go to welcome page. Else, send authorization failed page
                if (validUser === "wrongPassword") {
                    res.status(200).json({info: "Authorization failed", error_message: "Wrong Password, Please try again !"})
                } 
                else if (validUser === "emailNotFound") {
                    res.status(200).json({info: "Authorization failed", error_message: "Email Not Found, Please sign up !"})
                } 
                else {
                    // create absolute path for avatar image
                    const imageFileName = userdataRaw.rows[0].image_filename;
                    const imageFilePath = filePath + '/public/' + imageFileName

                    // convert the image path from local to url link
                    res.render('Welcome', {username: userdataRaw.rows[0].username, photo: takeImagefromURL(imageFilePath)})
                }
            }
        })
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
})



// === ROUTING for welcome page if user is admin
Router.post('/superadmin-credentials', async function(req, res) { 
    try {
        const form = formidable({ multiples: true})
            
        form.parse(req, async (err, fields, files) => {
            // get input from user
            const credentials = fields.credentials

            // check credentials 
            if (credentials === process.env.SUPERADMIN_CREDENTIALS) {
                res.redirect('/admin-dashboard')
            } else {
                res.sendFile(filePath + '/html_code/admin_page.html')
            }

        })

    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }
})

module.exports = Router






