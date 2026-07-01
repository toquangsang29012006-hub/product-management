const Product = require("../../models/product.model");

const filterStatusHelper = require("../../helper/filterStatus");

// [GET]  /admin/products
module.exports.index = async (req, res) => {

   const filterStatus = filterStatusHelper(req.query);

    const find = {
        deleted: false
    }

    let keyword = "";

    if(req.query.keyword) {
        keyword = req.query.keyword;

        const regex = new RegExp(keyword, "i");

        find.title = regex;
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
        keyword: keyword
    });
}