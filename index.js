require("express-async-errors");
require("dotenv").config();
const express = require("express");
const error = require("./middlewares/error");
const logger = require("./middlewares/logger");

const app = express();

require("./structure/cors")(app);
require("./structure/config")();
require("./structure/db")();
require("./structure/validation")();
require("./structure/routes")(app);
require("./structure/prod")(app);
app.use(error);

const port = process.env.PORT || 4000;

app.listen(port, () => {
   logger.info("listening for requests at port", port);
});