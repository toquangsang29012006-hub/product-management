const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();

const app = express();
const port = process.env.PORT;

const route = require("./routes/client/index.route");

mongoose.connect(process.env.MONGOOSE_URL);

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static('public'));

// Routes
route(app);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
