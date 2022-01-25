const Category = require("../../../config/db.config");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/category");
const { encode, decode } = require("../../../utils/encrypt");
const { getPostData } = require("../../../utils/getPostData");
const { addCategoryValidation, editCategoryValidation } = require("../validation/category.validation");


let addCategory = async (req, res) => {
    let response, categoryData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let categoryImage = body.categoryImage;
        let categoryName = body.categoryName
        if (addCategoryValidation(categoryName, categoryImage.data, categoryImage.name) == true) {
            Category.execute(`select * from category where categoryName = '${categoryName}'`, (err, data) => { categoryFound(data, categoryData); });
            let categoryFound = (data, category) => {
                category = data;
                if (category.length == 1) {
                    response = { status: 400, message: "This category already exists" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const buffer = Buffer.from(categoryImage.data, "base64");
                    const categoryImageURL = 'uploads/category/' + uniqueSuffix + '-' + categoryImage.name;
                    fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImage.name), buffer);
                    const idUniqueSuffix = Math.round(Math.random() * 1E9);
                    let categoryId = Date.now() + process.env.SECRET_ID_KEY + idUniqueSuffix;
                    categoryId = encode(categoryId);
                    Category.execute(`insert into category(_id, categoryName, categoryImageURL) values('${categoryId}','${categoryName}', '${categoryImageURL}')`);
                    response = { status: 200, message: "Success" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        } else {
            response = { status: 400, message: addCategoryValidation(categoryName, categoryImage.data, categoryImage.name) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let updateCategory = async (req, res) => {
    let response, categoryData, data, name;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let categoryId = req.paramsId;
        let categoryImage = body.categoryImage;
        let categoryName = body.categoryName;
        if (categoryImage) {
            data = categoryImage.data;
            name = categoryImage.name;
        }
        if (editCategoryValidation(categoryName, data, name == true)) {
            Category.execute(`select * from category where _id = '${categoryId}'`, (err, data) => { categoryFound(data, categoryData); });
            let updateQuery = (categoryName, categoryImageURL) => { Category.execute((`update category set categoryName = '${categoryName}', categoryImageURL = '${categoryImageURL}' where _id = '${categoryId}'`)); };
            let categoryFound = (data, category) => {
                category = data;
                if (category.length == 0) {
                    response = { status: 400, message: "Please enter a valid category id" };
                    response = JSON.stringify(response);
                    res.end(response)
                }
                else {
                    if (!categoryImage) categoryImageURL = category[0].categoryImageURL;
                    if (!categoryName) categoryName = category[0].categoryName;
                    if (categoryImage) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const buffer = Buffer.from(categoryImage.data, "base64");
                        categoryImageURL = 'uploads/category/' + uniqueSuffix + '-' + categoryImage.name;
                        fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + categoryImage.name), buffer);
                        fs.unlinkSync(category[0].categoryImageURL);
                    }
                    updateQuery(categoryName, categoryImageURL);
                    response = { status: 200, message: "Success" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        } else {
            response = { status: 400, message: editCategoryValidation(categoryName, categoryImage.data, categoryImage.name) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" + err };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let deleteCategory = async (req, res) => {
    let response, categoryData;
    try {
        let categoryId = req.paramsId;
        Category.execute(`select * from category where _id = '${categoryId}'`, (err, data) => { categoryFound(data, categoryData); });
        let categoryFound = (data, category) => {
            category = data;
            if (category.length == 1) {
                fs.unlinkSync(category[0].categoryImageURL);
                Category.execute(`delete from category where _id = '${categoryId}'`, (err) => {
                    if (true) {
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                });

            }
            else {
                response = { status: 400, message: "This category doesn't exist" };
                response = JSON.stringify(response);
                res.end(response);
            }
        }


    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let getAllCategories = async (req, res) => {
    let response, categoryData;
    try {
        Category.execute(`select * from category`, (err, data) => { categoryFound(data, categoryData); });
        let categoryFound = (data, categories) => {
            categories = data;
            response = { status: 200, message: "Success", allCategories: categories };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let recentCategories = async (req, res) => {
    let response, categoryData;
    try {
        Category.execute(`select * from category ORDER BY _id DESC limit 5`, (err, data) => { categoryFound(data, categoryData); });
        let categoryFound = (data, categories) => {
            categories = data;
            response = { status: 200, message: "Success", recentCategories: categories };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let getCategoryById = async (req, res) => {
    let categoryId = req.paramsId;
    let response, categoryData;
    try {
        Category.execute(`select * from category where _id = '${categoryId}'`, (err, data) => { categoryFound(data, categoryData); });
        let categoryFound = (data, category) => {
            category = data;
            response = { status: 200, message: "Success", category: category[0] };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}



module.exports = {
    addCategory,
    updateCategory,
    deleteCategory,
    getAllCategories,
    recentCategories,
    getCategoryById
}