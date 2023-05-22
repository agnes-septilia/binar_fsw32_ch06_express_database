//// CREATE FUNCTION TO SHOW PASSWORD IN HTML ////

function showPassword(idPassword) {
    const inputPassword = document.getElementById(idPassword)
    if (inputPassword.type === "password") {
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
}