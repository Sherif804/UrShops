const { isAdminAuthorized, isSharedAuthorized } = require("../../../utils/auth");
const { addStore, getAllStores, getStoreById, recentStores, updateStore, deleteStore, getStoreCategories, countUsersCategoriesStores } = require("../controller/store.controller");

let storeRoutes = async (req, res) => {
    if (req.url == "/addStore" && req.method == "POST") isAdminAuthorized(req, res, addStore);
    else if (req.url.match(/^[/]updateStore(.*)/) && req.method == "PUT") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, updateStore); }
    else if (req.url.match(/^[/]deleteStore(.*)/) && req.method == "DELETE") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, deleteStore); }
    else if (req.url.match(/^[/]getStoreById(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, getStoreById); }
    else if (req.url.match(/^[/]getStoreCategories(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, getStoreCategories); }
    else if (req.url == "/getAllStores" && req.method == "GET") isSharedAuthorized(req, res, getAllStores);
    else if (req.url == "/recentStores" && req.method == "GET") isAdminAuthorized(req,res, recentStores);
    else if (req.url == "/countUsersCategoriesStores" && req.method == "GET") isAdminAuthorized(req,res, countUsersCategoriesStores);
}


module.exports = storeRoutes;