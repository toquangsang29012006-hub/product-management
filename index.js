const express = require("express");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require("dotenv").config();

const database = require("./config/database")

const systemConfig = require("./config/system");


const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");

database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride('_method'));

app.set("views", "./views"); // trỏ về thư mục views ở thư mục gốc của ứng dụng
app.set("view engine", "pug"); // Template engine mà bạn muốn sử dụng.


// flash
app.use(cookieParser('JSKSHJFJDK'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
// End flash

// App locals variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static('public'));
app.use(bodyParser.urlencoded());



// Route
route(app);
routeAdmin(app);


app.listen(port, () => {
    console.log(`App listening on ${port}`);
})