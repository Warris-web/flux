const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/create", async (req, res) => {
  try {
    const {
      vendor_id,
      vendor_name,
      product_name,
      amount,
      customer_name,
      customer_phone,
      customer_email,
      order_mode,
      delivery_address,
      notes,
      receipt_code,
      payment_reference,
      status,
    } = req.body;

    const order = await Order.create({
      vendor_id,
      vendor_name,
      product_name,
      amount,
      customer_name,
      customer_phone,
      customer_email,
      order_mode,
      delivery_address,
      notes,
      receipt_code,
      payment_reference,
      status: status || "pending",
    });

    return res.status(201).json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/me/:phone", async (req, res) => {
  try {
    const orders = await Order.find({ customer_phone: req.params.phone }).sort({ createdAt: -1 });
    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;