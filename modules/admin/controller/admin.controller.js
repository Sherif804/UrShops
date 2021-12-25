const { addAdminValidation, adminSignInValidation, updateAdminValidation } = require("../validation/admin.validation");
const Admin = require("../../../config/db.config");
const { encode, decode } = require("../../../utils/encrypt");
const { getPostData } = require("../../../utils/getPostData");

let addAdmin = async (req, res) => {
    let response, adminData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        const { firstName, lastName, userName, password, role } = body;
        if (addAdminValidation(firstName, lastName, userName, password, role) == true) {
            Admin.execute(`select * from admin where userName = '${userName}'`, (err, data) => { adminFound(data, adminData); });
            let adminFound = (data, admin) => {
                admin = data;
                if (admin.length == 1) {
                    response = { status: 400, message: "This username already taken" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const idUniqueSuffix = Math.round(Math.random() * 1E9);
                    let hashedPassword = uniqueSuffix + process.env.SECRET_HASH_KEY + password;
                    let adminId = Date.now() + process.env.SECRET_ID_KEY + idUniqueSuffix;
                    hashedPassword = encode(hashedPassword);
                    adminId = encode(adminId);
                    if (role) {
                        Admin.execute(`insert into admin(_id, firstName, lastName, userName, password, role) values('${adminId}','${firstName}','${lastName}','${userName}','${hashedPassword}', '${role}')`);
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                    else {
                        Admin.execute(`insert into admin(_id, firstName, lastName, userName, password) values('${adminId}','${firstName}','${lastName}','${userName}','${hashedPassword}')`);
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                }
            }
        }
        else {
            response = { status: 400, message: addAdminValidation(firstName, lastName, userName, password, role) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}

let adminSignIn = async (req, res) => {
    let response, adminData;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        const { userName, password } = body;
        if (adminSignInValidation(userName, password) == true) {
            Admin.execute(`select * from admin where userName = '${userName}'`, (err, data) => { adminFound(data, adminData); });
            let adminFound = (data, admin) => {
                admin = data;
                if (admin.length == 0) {
                    response = { status: 400, message: "Please enter a valid username" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    let decodedPassword = decode(admin[0].password);
                    let pass = decodedPassword.split(process.env.SECRET_HASH_KEY)[1];
                    if (password == pass) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        let token = uniqueSuffix + process.env.SECRET_AUTH_KEY + admin[0]._id + process.env.SECRET_AUTH_KEY + admin[0].role + process.env.SECRET_AUTH_KEY + process.env.SECRET_HASH_KEY;
                        token = encode(token);
                        response = { status: 200, message: "Success", token: token };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                    else {
                        response = { status: 422, message: "This password is invalid" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                }
            }
        }
        else {
            response = { status: 400, message: adminSignInValidation(userName, password) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}

let updateAdmin = async (req, res) => {
    let response, adminData, firstName, lastName, userName, password, role;
    try {
        let body = await getPostData(req);
        body = JSON.parse(body);
        console.log(body.role);
        if (updateAdminValidation(body.firstName, body.lastName, body.userName, body.password, body.role) == true) {
            Admin.execute(`select * from admin where _id = '${req.paramsId}'`, (err, data) => { adminFound(data, adminData); });
            let updateQuery = () => { Admin.execute((`update admin set firstName = '${firstName}', lastName = '${lastName}', userName = '${userName}', password = '${password}', role = '${role}' where _id = '${req.paramsId}'`)); }
            let adminFound = (data, admin) => {
                admin = data;
                if (admin.length == 0) {
                    response = { status: 400, message: "Please enter a valid id" };
                    response = JSON.stringify(response);
                    res.end(response);
                }
                else {
                    if (body.firstName) { firstName = body.firstName; }
                    else { firstName = admin[0].firstName }
                    if (body.lastName) { lastName = body.lastName; }
                    else { lastName = admin[0].lastName; }
                    if (body.password) {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                        let hashedPassword = uniqueSuffix + process.env.SECRET_HASH_KEY + body.password;
                        password = encode(hashedPassword);
                    }
                    else { password = admin[0].password; }
                    if (body.role) { role = body.role; }
                    else { role = admin[0].role; }
                    if (body.userName) {
                        Admin.execute(`select * from admin where userName = '${body.userName}'`, (err, data) => { userNameFound(data, adminData); });
                    }
                    else {
                        userName = admin[0].userName;
                        updateQuery();
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response)
                    }
                    let userNameFound = (data, admin) => {
                        admin = data;
                        if (admin.length == 1) {
                            response = { status: 400, message: "UserName already taken" };
                            response = JSON.stringify(response);
                            res.end(response);
                        }
                        else {
                            userName = body.userName;
                            updateQuery();
                            response = { status: 200, message: "Success" };
                            response = JSON.stringify(response);
                            res.end(response)
                        }
                    }
                }
            }
        }
        else {
            response = { status: 400, message: updateAdminValidation(body.firstName, body.lastName, body.userName, body.password, body.role) };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}

let deleteAdmin = async (req, res) => {
    let response, adminData;
    try {
        Admin.execute(`select * from admin where _id = '${req.paramsId}'`, (err, data) => { adminFound(data, adminData); });
        let adminFound = (data, admin) => {
            admin = data;
            if (admin.length == 0) {
                response = { status: 400, message: "Please enter a valid id" };
                response = JSON.stringify(response);
                res.end(response);
            }
            else {
                Admin.execute(`delete from admin where _id = '${req.paramsId}'`, (err, data) => {
                    if (data) {
                        response = { status: 200, message: "Success" };
                        response = JSON.stringify(response);
                        res.end(response)
                    }
                    else if (err) {
                        response = { status: 500, message: "Something went wrong" };
                        response = JSON.stringify(response);
                        res.end(response);
                    }
                });
            }
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}

let getAllAdmins = async (req, res) => {
    let response, adminData;
    try {
        Admin.execute(`select _id, firstName, lastName, userName, role from admin`, (err, data) => { adminFound(data, adminData); });
        let adminFound = (data, admin) => {
            admin = data;
            response = { status: 200, message: "Success", allAdmins: admin };
            response = JSON.stringify(response);
            res.end(response);
        }
    } catch (err) {
        response = { status: 500, message: "Something went wrong" };
        response = JSON.stringify(response);
        res.end(response);
    }
}

let getAdminById = async (req, res) => {
    let response, adminData;
    try {
        Admin.execute(`select _id, firstName, lastName, userName, role from admin where _id = '${req.paramsId}'`, (err, data) => { adminFound(data, adminData); });
        let adminFound = (data, admin) => {
            admin = data;
            if (admin.length == 0) {
                response = { status: 400, message: "Please enter a valid id" };
                response = JSON.stringify(response);
                res.end(response);
            }
            else {
                response = { status: 200, message: "Success", admin: admin[0] };
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

let getCurrentAdmin = async (req, res) => {
    let response, adminData;
    try {
        Admin.execute(`select _id, firstName, lastName, userName, role from admin where _id = '${req.id}'`, (err, data) => { adminFound(data, adminData); });
        let adminFound = (data, admin) => {
            admin = data;
            if (admin.length == 0) {
                response = { status: 400, message: "Please enter a valid id" };
                response = JSON.stringify(response);
                res.end(response);
            }
            else {
                response = { status: 200, message: "Success", admin: admin[0] };
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
    addAdmin,
    adminSignIn,
    updateAdmin,
    deleteAdmin,
    getAllAdmins,
    getAdminById,
    getCurrentAdmin
}