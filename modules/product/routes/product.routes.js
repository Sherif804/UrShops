const { isAdminAuthorized, isSharedAuthorized } = require("../../../utils/auth");
const { addProduct, getAllProducts, getProductById, updateProduct, deleteProduct,
    storeTopRatedProducts, productSearch, productsByStoreAndCategory, topRatedProducts, storeProducts } = require("../controller/product.controller");

let storeRoutes = async (req, res) => {
    if (req.url == "/addProduct" && req.method == "POST") isAdminAuthorized(req, res, addProduct);
    else if (req.url.match(/^[/]updateProduct(.*)/) && req.method == "PUT") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, updateProduct); }
    else if (req.url.match(/^[/]deleteProduct(.*)/) && req.method == "DELETE") { req.paramsId = req.url.split("/")[2]; isAdminAuthorized(req, res, deleteProduct); }
    else if (req.url.match(/^[/]getProductById(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, getProductById); }
    else if (req.url.match(/^[/]storeProducts(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, storeProducts); }
    else if (req.url.match(/^[/]storeTopRatedProducts(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, storeTopRatedProducts); }
    else if (req.url.match(/^[/]productSearch(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSharedAuthorized(req, res, productSearch); }
    else if (req.url.match(/^[/]productsByStoreAndCategory(.*)/) && req.method == "GET")
    { req.paramsId = {storeId: req.url.split("/")[2], categoryId: req.url.split("/")[3]}; isSharedAuthorized(req, res, productsByStoreAndCategory); }
    else if (req.url == "/getAllProducts" && req.method == "GET") isSharedAuthorized(req, res, getAllProducts);
    else if (req.url == "/topRatedProducts" && req.method == "GET") isSharedAuthorized(req, res, topRatedProducts);
    
}


module.exports = storeRoutes;