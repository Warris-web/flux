// const express    = require("express");
// const router     = express.Router();
// const { scanProduct } = require("../controllers/scanController");

// router.post("/", scanProduct);
// module.exports = router;

const express = require("express");
const router = express.Router();
const { scanProduct } = require("../controllers/scanController");
const auth = require("../middleware/auth");

router.post("/", auth(), scanProduct);

module.exports = router;