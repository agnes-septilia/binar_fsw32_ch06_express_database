//// SCRIPT FOR SIGN UP PAGE ////

/* Main process happened in sign up page:
1. Check if the initial password and reconfirmation password is match
2. Save Avatar photo in public folder 
    -- for this project, image avatar.png is set as default
    -- if customer didn't upload new data, this avatar.png will be used as their avatar.
3. Save all user data in database user_games
*/


// import library
const fs = require('fs')
const {resolve} = require('path');


// create varilabe for filepath
const filePath = resolve()


// create query to check email from database
function checkEmail(email) {     
    const schema = process.env.PG_DATABASE_SCHEMA
    const query =  `
    SELECT email
    FROM "${schema}".user_games
    WHERE email = '${email}'
    ;
    `
    return query
}



// function to get file name of avatar photo from user --> save to public folder
function saveAvatar(files) { 
    filetype = files.avatar.mimetype

    if (filetype.substring(0, 5) === "image") {    // condition if customer upload new image
        // get the image path
        const oldPath = files.avatar.filepath ;
        const newPath = filePath + '/public/' + files.avatar.newFilename + '.png'

        // save the image in the local
        fs.copyFile(oldPath, newPath, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log("Image saved on public folder")
            }
        })

        return files.avatar.newFilename + '.png'

    } else {     // condition if customer do not upload new image
        return 'avatar.png'
    }
}


// create query to insert new user to Database
function insertQuery(fields, chiperedPassword, imageFileName) { 
    const schema = process.env.PG_DATABASE_SCHEMA
    
    const query =  `
    INSERT INTO "${schema}".user_games (username, email, password, image_filename, created_at, updated_at)
    VALUES ('${fields.username}', 
        '${fields.email}',
        '${chiperedPassword}',
        '${imageFileName}',
        current_timestamp,
        current_timestamp)
    ;
    `
    return query
}



// export modules
module.exports = {
    checkEmail,
    saveAvatar,
    insertQuery
}



