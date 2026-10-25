// const express = require("express");
// const router  = express.Router();
// const auth    = require("../middleware/auth");
// const {
//   registerVendor,
//   getNearbyVendors,
//   activateVendor,
//   getAllVendors,
// } = require("../controllers/vendorController");

// router.post("/register",  registerVendor);
// router.get("/nearby",     getNearbyVendors);
// router.get("/",           auth(["nafdac"]), getAllVendors);
// router.post("/activate",  auth(["nafdac"]), activateVendor);

// module.exports = router;
const express = require("express");
const router  = express.Router();
const auth    = require("../middleware/auth");
const {
  registerVendor,
  getNearbyVendors,
  getMyVendorProfile,
  updateProducts,
  activateVendor,
  activateByReference,
  getAllVendors,
  payVendor,
} = require("../controllers/vendorController");

router.post("/register",      registerVendor);
router.get("/nearby",         getNearbyVendors);
router.get("/me",             auth(["vendor"]), getMyVendorProfile);
router.put("/me/products",    auth(["vendor"]), updateProducts);
router.get("/",               auth(["nafdac"]), getAllVendors);
router.post("/activate",      auth(["nafdac"]), activateVendor);
router.post("/pay", auth(["user"]), payVendor);
router.post("/activate-by-reference", activateByReference);

module.exports = router;