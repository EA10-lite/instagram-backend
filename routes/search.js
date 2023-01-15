
const { search } = require("../controllers/search");

const _ = require("lodash");
const express = require("express");
const router = express.Router();

router.get("/",  search);


module.exports = router;