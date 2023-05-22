// ROUTER MIDDLEWARE FOR REGISTRATION PAGES

/* WORKFLOW
1. User will input their data on sign up page --> data will go through verification process as in signup_script.js
2. From sign up page, user will go to login page to re-input their data.
*/


// import modules
const express = require('express');
const {resolve} = require('path');
const formidable = require('formidable')
const CryptoJS = require ("crypto-js");

// activate router
const Router = express.Router();

// get modules from files
const filePath = resolve()
const signupModule = require(filePath + '/js_script/signup_script')


// use Built-In Middleware to work with url data
Router.use(express.urlencoded({ extended: false}))


// connect with database
const postgresqlDB = require(filePath + '/db/postgresql')


// === ROUTING for sign-up page
Router.get('/sign-up', function(req, res) {
    // open html page
    res.sendFile(filePath + '/html_code/signup.html')
});



// === ROUTING for login page if customer came from sign up page
Router.post('/log-in', async function(req, res){
    try{
        const form = formidable({ multiples: true})

        form.parse(req, async (err, fields, files) => {
            // chiper the passwords
            const chiperInitPassword = CryptoJS.HmacSHA256(fields.initialPassword, `${process.env.PASSKEY}`).toString()
            const chiperReconfirmPassword = CryptoJS.HmacSHA256(fields.reconfirmPassword, `${process.env.PASSKEY}`).toString() 

            // check if email has been registered 
            const dbEmailRaw = await postgresqlDB.client.query(signupModule.checkEmail(fields.email))
            const dbEmail = (dbEmailRaw.rows[0] === undefined) ? '' : dbEmailRaw.rows[0].email;

            // do not proceed if email is found on database
            if (dbEmail === fields.email) {   
                res.status(200).json({info: "Authorization failed", error_message: "Email has been used for sign up ! "})
            
            } 
            
            // do not proceed if the password is not match
            else if (chiperInitPassword !== chiperReconfirmPassword) {    
                res.status(200).json({info: "Authorization failed", error_message: "Retype password is not match with the first one ! "})
            } 
            
            // proceed if all validation passed
            else {

                // save avatar
                const imageFileName = signupModule.saveAvatar(files)
                // save data to database
                await postgresqlDB.client.query(signupModule.insertQuery(fields, chiperInitPassword, imageFileName))    
            
                // tampilkan halaman login
                res.sendFile(filePath + '/html_code/login.html')
            }
        })
    } catch(error) {
        console.log(error)
        res.status(500).send('Internal Server Error')
    }

});




// === ROUTING for login page if customer directly visit it without going through the sign up page first
Router.get('/log-in', function(req, res) { 
    res.sendFile(filePath + '/html_code/login.html')
})



module.exports = Router






