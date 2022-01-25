let { isEmpty, isText, isBase64, isImageExtension } = require("../../../utils/validation");


let addCategoryValidation = (categoryName, data, name) => {
    if (isText(categoryName) && categoryName && isBase64(data) && data && isImageExtension(name) && name) {
        return true;
    }
    else if (isEmpty(categoryName)) {
        return "You have to enter a category name";
    }
    else if (isEmpty(data)) {
        return "You have to enter a category image";
    }
    else if (isEmpty(name)) {
        return "You have to enter a category image";
    }
    else if (!isText(categoryName)) {
        return "Please enter a valid category name";
    }
    else if (!isBase64(data)) {
        return "Please enter a valid category image";
    }
    else if (!isImageExtension(name)) {
        return "Please enter a valid category image";
    }
}


let editCategoryValidation = (categoryName, data, name) => {
    
    if (isEmpty(categoryName) && isEmpty(data) && isEmpty(name)) {
        return "You have to enter updated category data";
    }
   
    else if (categoryName && !isText(categoryName)) {
        return "Please enter a valid category name";
    }
    else if (data && !isBase64(data)) {
        return "Please enter a valid category image";
    }
    else if (name && !isImageExtension(name)) {
        return "Please enter a valid category image";
    }

    else if ((isText(categoryName) && categoryName) || (isBase64(data) && data) || (isImageExtension(name) && name)) {
        return true;
    }
}


module.exports = {
    addCategoryValidation,
    editCategoryValidation

}