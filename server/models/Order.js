const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    product_name: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },

    customer_name: { type: String, required: true },
    customer_phone: { type: String, required: true },
    customer_email: { type: String, default: "" },

    order_mode: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
    delivery_address: { type: String, default: "" },
    notes: { type: String, default: "" },

    receipt_code: { type: String, required: true, unique: true },
    payment_reference: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "paid", "confirmed", "ready_for_pickup", "delivered", "cancelled"],
      default: "pending",
    },

    created_at: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);