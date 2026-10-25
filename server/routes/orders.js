// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");

// router.post("/create", async (req, res) => {
//   try {
//     const {
//       vendor_id,
//       vendor_name,
//       product_name,
//       amount,
//       customer_name,
//       customer_phone,
//       customer_email,
//       order_mode,
//       delivery_address,
//       notes,
//       receipt_code,
//       payment_reference,
//       status,
//     } = req.body;

//     const order = await Order.create({
//       vendor_id,
//       vendor_name,
//       product_name,
//       amount,
//       customer_name,
//       customer_phone,
//       customer_email,
//       order_mode,
//       delivery_address,
//       notes,
//       receipt_code,
//       payment_reference,
//       status: status || "pending",
//     });

//     return res.status(201).json({ success: true, order });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

// router.get("/me/:phone", async (req, res) => {
//   try {
//     const orders = await Order.find({ customer_phone: req.params.phone }).sort({ createdAt: -1 });
//     return res.json({ success: true, orders });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const router = express.Router();
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const { markOrderPaid } = require("../utils/orderPayment");

// If still pending, ask Paystack directly (covers slow/missing webhooks, e.g. on localhost)
async function syncWithPaystack(order) {
  if (order.status !== "pending") return order;
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key || !key.trim()) return order;

  try {
    const { data } = await axios.get(
      `${process.env.PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(order.receipt_code)}`,
      { headers: { Authorization: `Bearer ${key}` } }
    );
    const tx = data?.data;
    if (tx?.status === "success" && tx.amount === Math.round(order.amount * 100)) {
      await markOrderPaid(order.receipt_code, tx.reference);
      return (await Order.findById(order._id)) || order;
    }
  } catch (_) {
    // not initialised / network issue — keep as pending
  }
  return order;
}

async function serialize(orders) {
  const ids = [...new Set(orders.map((o) => o.vendor_id))].filter((id) => mongoose.isValidObjectId(id));
  const vendors = await Vendor.find({ _id: { $in: ids } }).select("address phone");
  const byId = Object.fromEntries(vendors.map((v) => [String(v._id), v]));

  return orders.map((o) => {
    const v = byId[o.vendor_id];
    return {
      code: o.receipt_code,
      status: o.status,
      mode: o.order_mode,
      product: o.product_name,
      productAmount: o.product_amount ?? o.amount,
      deliveryFee: o.delivery_fee || 0,
      total: o.amount,
      vendor: o.vendor_name,
      vendorAddress: v?.address || "",
      vendorPhone: v?.phone || "",
      customer_name: o.customer_name,
      delivery_address: o.delivery_address,
      payment_url: o.status === "pending" ? o.payment_url || null : null,
      created_at: o.createdAt || o.created_at,
    };
  });
}

// One receipt by code (used when the customer returns from Paystack)
router.get("/receipt/:code", async (req, res) => {
  try {
    let order = await Order.findOne({ receipt_code: req.params.code.toUpperCase() });
    if (!order) return res.status(404).json({ error: "Order not found" });
    order = await syncWithPaystack(order);
    const [out] = await serialize([order]);
    return res.json({ success: true, order: out });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Order history: the device sends the receipt codes it has saved
router.post("/lookup", async (req, res) => {
  try {
    const codes = (Array.isArray(req.body?.codes) ? req.body.codes : [])
      .filter((c) => typeof c === "string")
      .map((c) => c.toUpperCase())
      .slice(0, 50);
    if (codes.length === 0) return res.json({ success: true, orders: [] });

    let orders = await Order.find({ receipt_code: { $in: codes } }).sort({ createdAt: -1 });
    orders = await Promise.all(orders.map(syncWithPaystack));
    return res.json({ success: true, orders: await serialize(orders) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;