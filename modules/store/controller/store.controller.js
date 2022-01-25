const Store = require("../../../config/db.config");
const User = require("../../../config/db.config");
const Category = require("../../../config/db.config");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/store");
const { encode, decode } = require("../../../utils/encrypt");
const { getPostData } = require("../../../utils/getPostData");
const { addStoreValidation, editStoreValidation } = require("../validation/store.validation");


let addStore = async (req, res) => {
    let response, storeData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let storeImage = body.storeImage;
        let storeName = body.storeName;
        let telephoneNumber = body.telephoneNumber;
        let email = body.email;
        let storeCategories = body.storeCategories;
        if (addStoreValidation(storeName, email, telephoneNumber, storeImage.data, storeImage.name) == true) {
            Store.execute(`select * from store where storeName = '${storeName}'`, (err, data) => { storeFound(data, storeData); });
            let storeFound = (data, store) => {
                store = data;
                if (store.length == 1) {
                    response = { status: 400, message: "This store already exists" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const buffer = Buffer.from(storeImage.data, "base64");
                    const storeImageURL = 'uploads/store/' + uniqueSuffix + '-' + storeImage.name;
                    fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeImage.name), buffer);
                    const idUniqueSuffix = Math.round(Math.random() * 1E9);
                    let storeId = Date.now() + process.env.SECRET_ID_KEY + idUniqueSuffix;
                    storeId = encode(storeId);
                    let storeCategoryId = Date.now() + process.env.SECRET_ID_KEY + Math.round(Math.random() * 1E9);
                    storeCategoryId = encode(storeCategoryId);


                    Store.execute(`insert into store(_id, storeName, storeLogoURL, telephoneNumber, email) values('${storeId}','${storeName}', '${storeImageURL}', '${telephoneNumber}', '${email}')`);
                    for (let categoryIndex = 0; categoryIndex < storeCategories.length; categoryIndex++) {
                        let storeCategoryId = Date.now() + process.env.SECRET_ID_KEY + Math.round(Math.random() * 1E9);
                        storeCategoryId = encode(storeCategoryId);
                        Store.execute(`insert into storecategories(_id, storeId, categoryId) values('${storeCategoryId}','${storeId}', '${storeCategories[categoryIndex]}')`);
                    }
                    response = { status: 200, message: "Success" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        } else {
            response = { status: 400, message: addStoreValidation(storeName, email, telephoneNumber, storeImage.data, storeImage.name) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let updateStore = async (req, res) => {
    let response, storeData, data, name, storeLogoURL, storeNameData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let storeId = req.paramsId;
        let storeImage = body.storeImage;
        let storeName = body.storeName;
        let telephoneNumber = body.telephoneNumber;
        let email = body.email;
        let storeCategories = body.storeCategories;
        if (storeImage) {
            data = storeImage.data;
            name = storeImage.name;
        }
        if (editStoreValidation(storeName, email, telephoneNumber, data, name) == true) {
            Store.execute(`select * from store where _id = '${storeId}'`, (err, data) => { storeFound(data, storeData); });
            let updateQuery = (storeName, email, telephoneNumber, storeImageURL) => {
                Store.execute((`update store set storeName = '${storeName}', storeLogoURL = '${storeImageURL}', telephoneNumber = '${telephoneNumber}', email = '${email}' where _id = '${storeId}'`));
            };
            let storeFound = (data, store) => {
                store = data;
                if (store.length == 0) {
                    response = { status: 400, message: "Please enter a valid store id" };
                    response = JSON.stringify(response);
                    res.end(response)
                }
                else {
                    if (!storeName || (storeName && storeName == store[0].storeName)) {
                        storeName = store[0].storeName;
                        if (!storeImage) storeLogoURL = store[0].storeLogoURL;
                        if (!email) email = store[0].email;
                        if (!telephoneNumber) telephoneNumber = store[0].telephoneNumber;
                        if (storeImage) {
                            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                            const buffer = Buffer.from(storeImage.data, "base64");
                            storeLogoURL = 'uploads/store/' + uniqueSuffix + '-' + storeImage.name;
                            fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeImage.name), buffer);
                            fs.unlinkSync(store[0].storeLogoURL);
                        }
                        if (storeCategories) {
                            Store.execute(`delete from storecategories where storeId = '${storeId}'`);
                            for (let categoryIndex = 0; categoryIndex < storeCategories.length; categoryIndex++) {
                                let storeCategoryId = Date.now() + process.env.SECRET_ID_KEY + Math.round(Math.random() * 1E9);
                                storeCategoryId = encode(storeCategoryId);
                                Store.execute(`insert into storecategories(_id, storeId, categoryId) values('${storeCategoryId}','${storeId}', '${storeCategories[categoryIndex]}')`);
                            }
                        }
                        updateQuery(storeName, email, telephoneNumber, storeLogoURL);
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                    else if (storeName  && storeName != store[0].storeName) {
                        Store.execute(`select * from store where storeName = '${storeName}'`, (err, data) => { storeNameFound(data, storeNameData); });
                        let storeNameFound = (data, storeName) => {
                            storeName = data;
                            if (storeName.length > 0) {
                                response = { status: 400, message: "This store already exists" };
                                response = JSON.stringify(response);
                                res.end(response)
                            }
                            else {
                                if (!storeImage) storeLogoURL = store[0].storeLogoURL;
                                if (!email) email = store[0].email;
                                if (!telephoneNumber) telephoneNumber = store[0].telephoneNumber;
                                if (storeImage) {
                                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                                    const buffer = Buffer.from(storeImage.data, "base64");
                                    storeLogoURL = 'uploads/store/' + uniqueSuffix + '-' + storeImage.name;
                                    fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + storeImage.name), buffer);
                                    fs.unlinkSync(store[0].storeLogoURL);
                                }
                                if (storeCategories) {
                                    Store.execute(`delete from storecategories where storeId = '${storeId}'`);
                                    for (let categoryIndex = 0; categoryIndex < storeCategories.length; categoryIndex++) {
                                        let storeCategoryId = Date.now() + process.env.SECRET_ID_KEY + Math.round(Math.random() * 1E9);
                                        storeCategoryId = encode(storeCategoryId);
                                        Store.execute(`insert into storecategories(_id, storeId, categoryId) values('${storeCategoryId}','${storeId}', '${storeCategories[categoryIndex]}')`);
                                    }
                                }
                                updateQuery(body.storeName, email, telephoneNumber, storeLogoURL);
                                response = { status: 200, message: "Success" };
                                response = JSON.stringify(response);
                                res.end(response);
                            }

                        }
                    }
                }
            }
        } else {
            response = { status: 400, message: editStoreValidation(storeName, storeImage.data, storeImage.name) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let deleteStore = async (req, res) => {
    let response, storeData;
    try {
        let storeId = req.paramsId;
        Store.execute(`select * from store where _id = '${storeId}'`, (err, data) => { storeFound(data, storeData); });
        let storeFound = (data, store) => {
            store = data;
            if (store.length == 1) {
                fs.unlinkSync(store[0].storeLogoURL);
                Store.execute(`delete from store where _id = '${storeId}'`, (err) => {
                    if (true) {
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                });

            }
            else {
                response = { status: 400, message: "This store doesn't exist" };
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


let getAllStores = async (req, res) => {
    let response, storeData;
    try {
        Store.execute(`select * from store`, (err, data) => { storeFound(data, storeData); });
        let storeFound = (data, stores) => {
            stores = data;
            response = { status: 200, message: "Success", allStores: stores };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let recentStores = async (req, res) => {
    let response, storeData;
    try {
        Store.execute(`select * from store ORDER BY _id DESC limit 5`, (err, data) => { storeFound(data, storeData); });
        let storeFound = (data, stores) => {
            stores = data;
            response = { status: 200, message: "Success", recentstores: stores };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let getStoreById = async (req, res) => {
    let storeId = req.paramsId;
    let response, storeData;
    try {
        Store.execute(`select * from store where _id = '${storeId}'`, (err, data) => { storeFound(data, storeData); });
        let storeFound = (data, store) => {
            store = data;
            response = { status: 200, message: "Success", store: store };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let getStoreCategories = async (req, res) => {
    let storeId = req.paramsId;
    let catId, categoryData, response, storeCategoryData;
    let allCategories = []
    try {
        Store.execute(`select categoryId from storecategories where storeId = '${storeId}'`, (err, data) => { storeCategoryFound(data, storeCategoryData); });
        let storeCategoryFound = async (data, storeCategoriesIds) => {
            storeCategoriesIds = data;
            if (storeCategoriesIds.length >= 1) {
                for (let categoryIdIndex = 0; categoryIdIndex < storeCategoriesIds.length; categoryIdIndex++) {
                    catId = storeCategoriesIds[categoryIdIndex].categoryId
                    Category.execute(`select * from category where _id = '${catId}'`, (err, data) => { categoryFound(data, categoryData); });
                    let categoryFound = (data, category) => {
                        category = data;
                        allCategories.push(category[0])
                        if (categoryIdIndex == storeCategoriesIds.length - 1) {
                            response = { status: 200, message: "Success", storeCategories: allCategories };
                            response = JSON.stringify(response);
                            res.end(response);
                        }
                    }
                }
            } else {
                response = { status: 404, message: "Store Categories not found" };
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


let countUsersCategoriesStores = async (req, res) => {
    let response, storeCountData, userCountData, categoryCountData;
    try {
        Store.execute(`SELECT COUNT(_id) AS allStoresCount FROM store;`, (err, data) => { storeCount(data, storeCountData); });
        let storeCount = (data, allStoresCount) => {
            allStoresCount = data[0].allStoresCount;
            User.execute(`SELECT COUNT(_id) AS allUsersCount FROM user;`, (err, data) => { userCount(data, userCountData); });
            let userCount = (data, allUsersCount) => {
                allUsersCount = data[0].allUsersCount;
                Category.execute(`SELECT COUNT(_id) AS allCategoriesCount FROM category;`, (err, data) => { categoryCount(data, categoryCountData); });
                let categoryCount = (data, allCategoriesCount) => {
                    allCategoriesCount = data[0].allCategoriesCount;
                    response = { status: 200, message: "Success", countUsersCategoriesStores: { allStoresCount, allUsersCount, allCategoriesCount } };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }


}


module.exports = {
    addStore,
    updateStore,
    deleteStore,
    getAllStores,
    recentStores,
    getStoreById,
    getStoreCategories,
    countUsersCategoriesStores
}

