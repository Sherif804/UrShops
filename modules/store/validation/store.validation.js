
let { isEmpty, isText, isBase64, isImageExtension, isNum, isEmail } = require("../../../utils/validation");


let addStoreValidation = (storeName, email, telephoneNumber, data, name) => {
    if (isText(storeName) && storeName && isBase64(data) && data && isImageExtension(name) && name
        && isEmail(email) && email && isNum(telephoneNumber) && telephoneNumber) {
        return true;
    }

    else if (isEmpty(storeName)) {
        return "You have to enter a store name";
    }
    else if (isEmpty(data)) {
        return "You have to enter a store image";
    }
    else if (isEmpty(name)) {
        return "You have to enter a store image";
    }
    else if (isEmpty(email)) {
        return "You have to enter a email";
    }
    else if (isEmpty(telephoneNumber)) {
        return "You have to enter a telephone number";
    }


    else if (!isText(storeName)) {
        return "Please enter a valid store name";
    }
    else if (!isBase64(data)) {
        return "Please enter a valid store image";
    }
    else if (!isImageExtension(name)) {
        return "Please enter a valid store image";
    }
    else if (!isEmail(email)) {
        return "Please enter a valid email";
    }
    else if (!isNum(telephoneNumber)) {
        return "Please enter a valid telephone number";
    }
}


let editStoreValidation = (storeName, email, telephoneNumber, data, name) => {

    if (isEmpty(storeName) && isEmpty(data) && isEmpty(name) && isEmpty(email) && isEmpty(telephoneNumber)) {
        return "You have to enter a store data";
    }

    else if (storeName && !isText(storeName)) {
        return "Please enter a valid storeName";
    }
    else if (data && !isBase64(data)) {
        return "Please enter a valid data";
    }
    else if (name && !isImageExtension(name)) {
        return "Please enter a valid name";
    }
    else if (!isEmail(email)) {
        return "Please enter a valid email";
    }
    else if (!isNum(telephoneNumber)) {
        return "Please enter a valid telephoneNumber";
    }

    else if (isText(storeName) && storeName || isBase64(data) && data || isImageExtension(name) && name || isEmail(email) && email || isNum(telephoneNumber) && telephoneNumber) 
    {
        return true;
    }
}


module.exports = {
    addStoreValidation,
    editStoreValidation

}