const Product = require("../../models/product.model");
const systemConfig = require("../../config/system");
const filterStatusHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

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
    const countProduct = await Product.countDocuments(find);

    let objectPagination = paginationHelper(
        {
            currentPage: 1,
            limitItem: 4
        },
        req.query,
        countProduct
    )

    // End Pagination


    if(req.query.status){
        find.status = req.query.status;
    }
    

    const products = await Product.find(find).sort({position: "desc"}).limit(objectPagination.limitItem).skip(objectPagination.skip);

    // console.log(products);

    res.render("admin/pages/products/index", {
        pageTitle: "Trang danh sách sản phẩm",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    
    await Product.updateOne({_id: id}, {status: status});

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect(req.get('Referrer') || '/');
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    switch(type){
        case "active":
            await Product.updateMany({_id: {$in: ids} }, {status: "active"});
            req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            break;
        case "inactive":
            await Product.updateMany({_id: {$in: ids} }, {status: "inactive"});
            req.flash('success', `Cập nhật trạng thái của ${ids.length} sản phẩm thành công!`);
            break;
            break;
        case "delete-all":
            await Product.updateMany(
                {_id: {$in: ids}},
                {
                    deleted: true,
                    deleteAt: new Date()
                }
            )
        case "change-position":
            for (let item of ids){
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Product.updateOne({_id: id}, {position: position});
            }
        default: 
            break;
    }
    res.redirect(req.get('Referrer') || '/');
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;

    // await Product.deleteOne({_id: id});
    await Product.updateOne({_id: id}, {
        deleted: true,
        deleteAt: new Date()
    });

    res.redirect(req.get('Referrer') || '/');
}

// [GET] /admin/products/create
module.exports.createGet = (req, res) => {
    res.render("admin/pages/products/create", {
        pageTitle: "Thêm mới sản phẩm"
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    console.log(req.file);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == ""){
        const countProduct = await Product.countDocuments();
        req.body.position = countProduct + 1;
    }else{
        req.body.position = parseInt(req.body.position);
    }

    req.body.thumbnail = `/uploads/${req.file.filename}`;

    const products = new Product(req.body);

    await products.save();
    res.redirect(`${systemConfig.prefixAdmin}/products`);
}