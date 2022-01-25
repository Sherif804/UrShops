const { isAdminAuthorized, isUserAuthorized, isSharedAuthorized } = require("../../../utils/auth");
const { addProductToWishlist, removeProductFromWishlist, getUserWishlist } = require("../controller/wishlist.controller");

let wishlistRoutes = async (req, res) => {
    if (req.url.match(/^[/]addProductToWishlist(.*)/) && req.method == "POST") { req.paramsId = req.url.split("/")[2]; isUserAuthorized(req, res, addProductToWishlist); }
    else if (req.url.match(/^[/]removeProductFromWishlist(.*)/) && req.method == "DELETE") { req.paramsId = req.url.split("/")[2]; isUserAuthorized(req, res, removeProductFromWishlist); }
    else if (req.url == "/getUserWishlist" && req.method == "GET") { isUserAuthorized(req, res, getUserWishlist); }

}


module.exports = wishlistRoutes;