const { addAdmin, adminSignIn, updateAdmin, deleteAdmin, getAllAdmins, getAdminById, getCurrentAdmin } = require("../controller/admin.controller");
const { isSuperAdminAuthorized, isAdminAuthorized } = require("../../../utils/auth");

let adminRoutes = async (req, res) => {
    //Dashboard
    if (req.url == "/addAdmin" && req.method == "POST") isSuperAdminAuthorized(req, res, addAdmin);
    else if (req.url == "/adminSignIn" && req.method == "POST") adminSignIn(req, res);
    else if (req.url.match(/^[/]updateAdmin(.*)/) && req.method == "PUT") { req.paramsId = req.url.split("/")[2]; isSuperAdminAuthorized(req, res, updateAdmin); }
    else if (req.url.match(/^[/]deleteAdmin(.*)/) && req.method == "DELETE") { req.paramsId = req.url.split("/")[2]; isSuperAdminAuthorized(req, res, deleteAdmin); }
    else if (req.url == "/getAllAdmins" && req.method == "GET") isSuperAdminAuthorized(req, res, getAllAdmins);
    else if (req.url.match(/^[/]getAdminById(.*)/) && req.method == "GET") { req.paramsId = req.url.split("/")[2]; isSuperAdminAuthorized(req, res, getAdminById); }
    else if (req.url == "/getCurrentAdmin" && req.method == "GET") isAdminAuthorized(req, res, getCurrentAdmin);
}

module.exports = adminRoutes;