const express = require("express");
const app = express();
const port = 3000;

const route = require("./routes/client/index.route");

app.set("views", "./views"); // trỏ về thư mục views ở thư mục gốc của ứng dụng
app.set("view engine", "pug"); // Template engine mà bạn muốn sử dụng.


// Route
route(app);


app.listen(port, () => {
    console.log(`App listening on ${port}`);
})