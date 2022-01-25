const { isAdminAuthorized, isSharedAuthorized } = require("../../../utils/auth");
const { addCategory, getAllCategories, getCategoryById, recentCategories, updateCategory, deleteCategory } = require("../controller/category.controller");

let categoryRoutes = async (req, res) => {
    if (req.url == "/addCategory" && req.method == "POST") isAdminAuthorized(req, res, addCategory);
    else if (req.url.match(/^[/]updateCategory(.*)/) && req.method == "PUT") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, updateCategory); }
    else if (req.url.match(/^[/]deleteCategory(.*)/) && req.method == "DELETE") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, deleteCategory); }
    else if (req.url.match(/^[/]getCategoryById(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, getCategoryById); }
    else if (req.url == "/getAllCategories" && req.method == "GET") isAdminAuthorized(req, res, getAllCategories);
    else if (req.url == "/recentCategories" && req.method == "GET") isAdminAuthorized(req,res, recentCategories);
}


module.exports = categoryRoutes;