
let { isEmpty, isText, isBase64, isImageExtension, isNum, isBoolean, isAlphaNum } = require("../../../utils/validation");


let addProductValidation = (productName, rate, price, data, name, storeId, categoryId) => {

    if (isText(productName) && productName && isBase64(data) && data && isImageExtension(name) && name && isNum(rate) && rate && isNum(price) && price
        && isAlphaNum(storeId) && storeId && isAlphaNum(categoryId) && categoryId) {
        return true;
    }

    else if (isEmpty(productName)) {
        return "You have to enter a productName";
    }
    else if (isEmpty(data)) {
        return "You have to enter a data";
    }
    else if (isEmpty(name)) {
        return "You have to enter a name";
    }
    else if (isEmpty(rate)) {
        return "You have to enter a rate";
    }
    else if (isEmpty(price)) {
        return "You have to enter a price";
    }

   

    else if (!isText(productName)) {
        return "Please enter a valid productName";
    }
    else if (!isBase64(data)) {
        return "Please enter a valid data";
    }
    else if (!isImageExtension(name)) {
        return "Please enter a valid name";
    }
    else if (!isNum(rate)) {
        return "Please enter a valid rate";
    }
    else if (!isNum(price)) {
        return "Please enter a valid price";
    }
    
    else if (!isAlphaNum(storeId)) {
        return "Please enter a valid storeId";
    }
    else if (!isAlphaNum(categoryId)) {
        return "Please enter a valid categoryId";
    }
}


let editProductValidation = (productName, rate, price, data, name,  storeId, categoryId) => {

    if (isEmpty(productName) && isEmpty(data) && isEmpty(name) && isEmpty(rate) && isEmpty(price)
        && isEmpty(storeId) && isEmpty(categoryId)) {
        return "You have to enter a product data";
    }

    else if (productName && !isText(productName)) {
        return "Please enter a valid productName";
    }
    else if (data && !isBase64(data)) {
        return "Please enter a valid data";
    }
    else if (name && !isImageExtension(name)) {
        return "Please enter a valid name";
    }
    else if (!isNum(rate)) {
        return "Please enter a valid rate";
    }
    else if (!isNum(price)) {
        return "Please enter a valid price";
    }
   
    else if (storeId && !isAlphaNum(storeId)) {
        return "Please enter a valid storeId";
    }
    else if (categoryId && !isAlphaNum(categoryId)) {
        return "Please enter a valid categoryId";
    }

    else if (isText(productName) && productName || isBase64(data) && data || isImageExtension(name) && name || isNum(rate) && rate || isNum(price) && price
        || isAlphaNum(storeId) && storeId || isAlphaNum(categoryId) && categoryId) {
        return true;
    }
}


module.exports = {
    addProductValidation,
    editProductValidation

}