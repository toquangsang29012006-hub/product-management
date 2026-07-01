const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

// [GET]  /admin/products
module.exports.index = async (req, res) => {

   const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    const objectSearch = searchHelper(req.query);

    if(objectSearch.keyword) {
        find.title = objectSearch.regex;
    }

    if(req.query.status){
        find.status = req.query.status;
    }
    

    const products = await Product.find(find);

    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword
    });
}