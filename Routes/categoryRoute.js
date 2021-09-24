const express = require('express');
const router = express.Router();

const { createCategory, getCategories, updateCategory, deleteCategory } = require("../Controllers/categoryController");
const { isAuth } = require("../Middlewares/authMiddleware");

router.get("/", getCategories);
router.post("/create", [isAuth] , createCategory);
router.patch("/update/:id", [isAuth] , updateCategory);
router.delete("/delete/:id", [isAuth] , deleteCategory);

module.exports = router;