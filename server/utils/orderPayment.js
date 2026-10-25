const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

// Flips pending -> paid exactly once (atomic), then credits the vendor.
// Safe to call from both the webhook and the verify-on-return route.
// Returns the updated order, or null if it was already paid / not found.
exports.markOrderPaid = async (receipt_code, reference = "") => {
  const order = await Order.findOneAndUpdate(
    { receipt_code, status: "pending" },
    { status: "paid", payment_reference: reference || receipt_code },
    { new: true }
  );

  if (order) {
    await Vendor.findByIdAndUpdate(order.vendor_id, {
      $inc: { orders_count: 1, revenue: order.product_amount || 0 }, // product only, not delivery
    });
  }
  return order;
};