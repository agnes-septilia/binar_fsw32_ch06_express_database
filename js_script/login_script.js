//// SCRIPT FOR LOGIN PAGE ////

/* Main process happened in login page:
1. User authentification --> check if user email and password is available in database
2. Get authentification result --> based on the result, we will decide the next page for user 
*/


const schema = process.env.PG_DATABASE_SCHEMA

// create query to get email from database
function getUserdata(email) {     
    const query =  `
    SELECT *
    FROM "${schema}".user_games
    WHERE email = '${email}'
    ;
    `
    return query
}


// function to authorize user data in login page 
function loginAuth(loginEmail, loginPassword, dbEmail, dbPassword) {
    let output = ""

    if (dbEmail === loginEmail) {
        if (dbPassword === loginPassword) {   // "success" if email is found and password is correct
            output = "success"
        } else {
            output = "wrongPassword"    // "wrong password" if email is found but password is incorrect
        }
    } else {
        output = "emailNotFound"    // "email not found" if email is not found in database
    }
    
    return output

}



// export module
module.exports = {
    getUserdata,
    loginAuth
}




