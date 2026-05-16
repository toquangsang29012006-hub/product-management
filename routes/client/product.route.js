const express = require("express");
const route = express.Router();

route.get("/products", (req, res) => {
    res.render('client/pages/products/index');
});

module.exports = route;