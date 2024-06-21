const express = require("express");
const router = express.Router();

const {getUsers,userLogin}= require ("../controllers/userController");
router.get("/users", getUsers);
router.post("/login", userLogin);

module.exports = router;
