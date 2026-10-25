require("dotenv").config();
const mongoose = require("mongoose");
const Vendor = require("../models/Vendor");

// usage:
//   node scripts/setDeliveryFee.js 1500            -> set every product to ₦1500, overwriting
//   node scripts/setDeliveryFee.js 1500 --missing  -> only products with no fee yet (keeps fees vendors already set)
const fee = Number(process.argv[2]);
const onlyMissing = process.argv.includes("--missing");

if (!Number.isFinite(fee) || fee < 0) {
  console.error("Usage: node scripts/setDeliveryFee.js <amount> [--missing]");
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const filter = onlyMissing
    ? { "products.delivery_fee": { $in: [0, null] } }
    : { "products.0": { $exists: true } };

  // arrayFilters updates every product inside every vendor in one query
  const res = await Vendor.updateMany(
    filter,
    { $set: { "products.$[p].delivery_fee": fee } },
    { arrayFilters: [onlyMissing
        ? { $or: [{ "p.delivery_fee": { $exists: false } }, { "p.delivery_fee": 0 }, { "p.delivery_fee": null }] }
        : {}] }
  );

  console.log(`Vendors matched: ${res.matchedCount}, modified: ${res.modifiedCount}`);

  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });