let { isEmpty, isAlphaNum, isAlphabetic, isPassword } = require("../../../utils/validation");

let addAdminValidation = (firstName, lastName, userName, password, role) => {
    if (isAlphabetic(firstName) && isAlphabetic(lastName) && isAlphaNum(userName) && isPassword(password) && (!role || (role && (role == "admin" || role == "superAdmin")))
        && firstName && lastName && userName && password) {
        return true;
    }
    else if (!firstName || isEmpty(firstName)) {
        return "You have to enter first name";
    }
    else if (!lastName || isEmpty(lastName)) {
        return "You have to enter last name";
    }
    else if (!userName || isEmpty(userName)) {
        return "You have to enter user name";
    }
    else if (!password || isEmpty(password)) {
        return "You have to enter password";
    }
    else if (!isAlphabetic(firstName)) {
        return "Please enter a valid first name";
    }
    else if (!isAlphabetic(lastName)) {
        return "Please enter a valid last name";
    }
    else if (!isAlphaNum(userName)) {
        return "Please enter a valid user name";
    }
    else if (!isPassword(password)) {
        return "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one special character and one number";
    }
    else if (role && (role != "admin" || role != "superAdmin")) {
        return "Please enter a valid role";
    }
}

let adminSignInValidation = (userName, password) => {
    if (isAlphaNum(userName) && isPassword(password) && userName && password) {
        return true;
    }
    else if (!userName || isEmpty(userName)) {
        return "You have to enter user name";
    }
    else if (!password || isEmpty(password)) {
        return "You have to enter password";
    }
    else if (!isAlphaNum(userName)) {
        return "Please enter a valid user name";
    }
    else if (!isPassword(password)) {
        return "Please enter a valid password";
    }
}

let updateAdminValidation = (firstName, lastName, userName, password, role) => {
    if(!(firstName || lastName || userName || password || role)) {
        return "You have to enter updated data";
    }
    else if(!isAlphabetic(firstName) && firstName) {
        return "Please enter a valid first name";
    }
    else if(!isAlphabetic(lastName) && lastName) {
        return "Please enter a valid last name";
    }
    else if(!isAlphaNum(userName) && userName) {
        return "Please enter a valid user name";
    }
    else if(!isPassword(password) && password) {
        return "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one special character and one number";
    }
    else if ((isAlphabetic(firstName) && firstName) || (isAlphabetic(lastName) && lastName) || (isAlphaNum(userName) && userName) || 
    (isPassword(password) && password) || (role && (role == "admin" || role == "superAdmin"))) {
        return true;
    }
    else if(role && (role !== "admin" || role !== "superAdmin")) {
        return "Please enter a valid role";
    }
}

module.exports = {
    addAdminValidation,
    adminSignInValidation,
    updateAdminValidation
}