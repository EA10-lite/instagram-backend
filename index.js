require("express-async-errors");
const express = require("express");
const error = require("./middlewares/error");
const app = express();
const logger = require("./middlewares/logger");

require("./structure/cors")(app);
require("./structure/config")();
require("./structure/db")();
require("./structure/validation")();
require("./structure/routes")(app);
app.use(error);

const port = process.env.PORT || 5000;
app.listen(port, () => {
   logger.info("listening for requests at port", port);
});