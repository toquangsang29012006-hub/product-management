const express = require("express");
require("dotenv").config();

const database = require("./config/database")

const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.set("views", "./views"); // trỏ về thư mục views ở thư mục gốc của ứng dụng
app.set("view engine", "pug"); // Template engine mà bạn muốn sử dụng.

app.use(express.static('public'));


// Route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`App listening on ${port}`);
})