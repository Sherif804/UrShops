
const Product = require("../../../config/db.config");
const fs = require('fs');
const path = require('path');
const uploadFolder = path.join(__dirname, "../../../uploads/product");
const { encode } = require("../../../utils/encrypt");
const { getPostData } = require("../../../utils/getPostData");
const { addProductValidation, editProductValidation } = require("../validation/product.validation");


let addProduct = async (req, res) => {
    let response, productData, productInStock, isTopProduct;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let productImage = body.productImage;
        let productName = body.productName;
        let price = body.price;
        let rate = body.rate;
        let inStock = body.inStock
        let topProduct = body.topProduct
        let storeId = body.storeId
        let categoryId = body.categoryId
        
        if (addProductValidation(productName, rate, price, productImage.data, productImage.name, storeId, categoryId) == true) {
            Product.execute(`select * from product where productName = '${productName}' and storeId = '${storeId}' and categoryId = '${categoryId}' and price = '${price}'`,
                (err, data) => { productFound(data, productData); });
            let productFound = (data, product) => {
                product = data;
                if (product.length == 1) {
                    response = { status: 400, message: "This product already exists in this store category" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const buffer = Buffer.from(productImage.data, "base64");
                    const productImageURL = 'uploads/product/' + uniqueSuffix + '-' + productImage.name;
                    fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImage.name), buffer);
                    const idUniqueSuffix = Math.round(Math.random() * 1E9);
                    let productId = Date.now() + process.env.SECRET_ID_KEY + idUniqueSuffix;
                    productId = encode(productId);
                    if(inStock == true) { productInStock = 1;}
                    else {productInStock = 0;}
                    if(topProduct == true) { isTopProduct = 1;}
                    else {isTopProduct = 0;}
                    Product.execute(`insert into product(_id, productName, rate, price, productImageURL, inStock, topProduct, storeId, categoryId) 
                    values('${productId}','${productName}', '${rate}', '${price}', '${productImageURL}', '${productInStock}', '${isTopProduct}', '${storeId}', '${categoryId}' )`);
                    response = { status: 200, message: "Success" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        } else {
            response = { status: 400, message: addProductValidation(productName, rate, price, productImage.data, productImage.name, storeId, categoryId) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let updateProduct = async (req, res) => {
    let response, productData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        let productId = req.paramsId
        let productImage = body.productImage;
        let productName = body.productName;
        let price = body.price;
        let rate = body.rate;
        let inStock = body.inStock
        let topProduct = body.topProduct
        let storeId = body.storeId
        let categoryId = body.categoryId
        if (editProductValidation(productName, rate, price, productImage.data, productImage.name, storeId, categoryId) == true) {
            Product.execute(`select * from product where _id = '${productId}'`, (err, data) => { productFound(data, productData); });
            let updateQuery = (productName, rate, price, productImageURL, inStock, topProduct, storeId, categoryId) => {
                Product.execute((`update product set productName = '${productName}', productImageURL = '${productImageURL}', price = '${price}', rate = '${rate}',
                inStock = '${inStock}', topProduct = '${topProduct}', storeId = '${storeId}', categoryId = '${categoryId}'
                where _id = '${productId}'`));
            };
            let productFound = (data, product) => {
                product = data;
                if (product.length == 0) {
                    response = { status: 400, message: "Please enter a valid product id" };
                    response = JSON.stringify(response);
                    res.end(response)
                }
                else {
                    if (!productImage) productImageURL = product[0].productImageURL;
                    if (!productName) productName = product[0].productName;
                    if (!rate) rate = product[0].rate;
                    if (!price) price = product[0].price;
                    if (!inStock) inStock = product[0].inStock;
                    if (!topProduct) topProduct = product[0].topProduct;
                    if (!storeId) storeId = product[0].storeId;
                    if (!categoryId) categoryId = product[0].categoryId;
                    if(inStock && inStock == true) { inStock = 1;}
                    if(inStock && inStock == false) {inStock = 0;}
                    if(topProduct && topProduct == true) { topProduct = 1;}
                    if(topProduct && topProduct == false) {topProduct = 0;}
                    if (productImage) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        const buffer = Buffer.from(productImage.data, "base64");
                        productImageURL = 'uploads/product/' + uniqueSuffix + '-' + productImage.name;
                        fs.writeFileSync(path.join(uploadFolder, uniqueSuffix + '-' + productImage.name), buffer);
                    }
                    updateQuery(productName, rate, price, productImageURL, inStock, topProduct, storeId, categoryId);
                    response = { status: 200, message: "Success" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
            }
        } else {
            response = { status: 400, message: editProductValidation(productName, rate, price, productImage.data, productImage.name, storeId, categoryId) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let deleteProduct = async (req, res) => {
    let response, productData;
    try {
        let productId = req.paramsId;
        Product.execute(`select * from product where _id = '${productId}'`, (err, data) => { productFound(data, productData); });
        let productFound = (data, product) => {
            product = data;
            if (product.length == 1) {
                fs.unlinkSync(product[0].productImageURL);
                Product.execute(`delete from product where _id = '${productId}'`, (err) => {
                    if (true) {
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                });

            }
            else {
                response = { status: 400, message: "This product doesn't exist" };
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


let getAllProducts = async (req, res) => {
    let response, productData;
    try {
        Product.execute(`select * from product`, (err, data) => { productFound(data, productData); });
        let productFound = (data, products) => {
            products = data;
            response = { status: 200, message: "Success", allProducts: products };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let getProductById = async (req, res) => {
    let productId = req.paramsId;
    let response, productData;
    try {
        Product.execute(`select * from product where _id = '${productId}'`, (err, data) => { productFound(data, productData); });
        let productFound = (data, product) => {
            product = data;
            response = { status: 200, message: "Success", product: product };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let productSearch = async (req, res) => {
    let productName = req.paramsId;
    let response, productData;
    try {
        Product.execute(`select * from product where productName like '%${productName}%'`, (err, data) => { productFound(data, productData); });
        let productFound = (data, products) => {
            products = data;
            response = { status: 200, message: "Success", products: products };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let topRatedProducts = async (req, res) => {
    let response, productData;
    try {
        Product.execute(`select * from product where topProduct = 1`, (err, data) => { productFound(data, productData); });
        let productFound = (data, products) => {
            products = data;
            response = { status: 200, message: "Success", topRatedProducts: products };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let storeProducts = async (req, res) => {
    let storeId = req.paramsId;
    let response, productData;
    try {
        Product.execute(`select * from product where storeId = '${storeId}'`, (err, data) => { productFound(data, productData); });
        let productFound = (data, product) => {
            product = data;
            response = { status: 200, message: "Success", product: product };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}


let storeTopRatedProducts = async (req, res) => {
    let storeId = req.paramsId;
    let response, productData;
    try {
        Product.execute(`select * from product where storeId = '${storeId}' and  topProduct = 1`, (err, data) => { productFound(data, productData); });
        let productFound = (data, products) => {

            products = data;
            console.log(products);
            if (products.length >= 1) {
                response = { status: 200, message: "Success", products: products };
                response = JSON.stringify(response);
                res.end(response);
            } else {
                response = { status: 200, message: "No top products found for this store"};
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


let productsByStoreAndCategory = async (req, res) => {
    let storeId = req.paramsId.storeId;
    let categoryId = req.paramsId.categoryId;
    let response, productData;
    try {
        Product.execute(`SELECT * FROM product WHERE storeId = '${storeId}' AND categoryId = '${categoryId}';`, (err, data) => { productFound(data, productData); });
        let productFound = (data, product) => {
            product = data;
            if (product.length >= 1) {
                response = { status: 200, message: "Success", products: product };
                response = JSON.stringify(response);
                res.end(response);
            } else {
                response = { status: 404, message: "Products not found" };
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
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    productSearch,
    getProductById,
    storeProducts,
    storeTopRatedProducts,
    topRatedProducts,
    productsByStoreAndCategory
}