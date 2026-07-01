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

    if(objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    // Pagination
    let objectPagination = {
        currentPage: 1,
        limitItem: 4
    }

    if(req.query.page){
        objectPagination.currentPage = parseInt(req.query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

    const countProduct = await Product.countDocuments(find);
    const totalPage = Math.ceil(countProduct/objectPagination.limitItem);

    objectPagination.totalPage = totalPage;
    // End Pagination

    
    if(req.query.status){
        find.status = req.query.status;
    }
    

    const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip);

    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}