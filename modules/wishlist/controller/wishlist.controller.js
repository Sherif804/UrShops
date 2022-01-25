const Wishlist = require("../../../config/db.config");
const { encode } = require("../../../utils/encrypt");


let addProductToWishlist = async (req, res) => {
    let response, wishlistData;
    try {
        let productId = req.paramsId;
        let userId = req.id;
        Wishlist.execute(`select * from wishlist where userId = '${userId}' and productId = '${productId}'`, (err, data) => { wishlistFound(data, wishlistData); });
        let wishlistFound = (data, wishlist) => {
            wishlist = data;
            if (wishlist.length == 1) {
                response = { status: 400, message: "This product is already in user's wishlist" };
                response = JSON.stringify(response);
                res.end(response);
            }
            else {
                const idUniqueSuffix = Math.round(Math.random() * 1E9);
                let wishlistId = Date.now() + process.env.SECRET_ID_KEY + idUniqueSuffix;
                wishlistId = encode(wishlistId);
                Wishlist.execute(`insert into wishlist(_id, userId, productId) values('${wishlistId}', '${userId}', '${productId}')`);
                response = { status: 200, message: "Success" };
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



let removeProductFromWishlist = async (req, res) => {
    let response, wishlistData;
    try {
        let productId = req.paramsId;
        Wishlist.execute(`SELECT * FROM wishlist WHERE userId = '${req.id}' AND productId = '${productId}';`, (err, data) => { wishlistFound(data, wishlistData); });
        let wishlistFound = (data, wishlist) => {
            wishlist = data;
            if (wishlist.length == 1) {
                Wishlist.execute(`DELETE FROM wishlist WHERE userId = '${req.id}' AND productId = '${productId}';`, (err) => {
                    if (true) {
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                });
            }
            else {
                response = { status: 400, message: "This product is already not in user's wishlist" };
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


let getUserWishlist = async (req, res) => {
    let response, wishlistData, productData
    let userWishlist = [];
    try {
        Wishlist.execute(`SELECT * FROM wishlist where userId = '${req.id}';`, (err, data) => { wishlistFound(data, wishlistData); });
        let wishlistFound = (data, wishlist) => {
            wishlist = data;
            if (wishlist.length >= 1) {
                for (let i = 0; i < wishlist.length; i++) {
                    productId = wishlist[i].productId;
                    Wishlist.execute(`select * from product where _id = '${productId}'`, (err, data) => { productFound(data, productData); });
                    let productFound = (data, product) => {
                        product = data;
                        userWishlist.push(product[0])
                        if (i == wishlist.length - 1) {
                            response = { status: 200, message: "Success", userWishlist: userWishlist };
                            response = JSON.stringify(response);
                            res.end(response);
                        }
                    }
                }
            }
            else {
                response = { status: 200, message: "Empty Wishlist" };
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



module.exports = {
    addProductToWishlist,
    removeProductFromWishlist,
    getUserWishlist
}