const { Router } = require("express");
const { login, register } = require("../controllers/auth.controller");
const isAdmin = require("../middlewares/isAdmin");
const isAuth = require("../middlewares/isAuth");
const router = Router();

const route = "/auth";

router.post(`${route}/login`, login);
router.post(`${route}/register`, register), (module.exports = router);
