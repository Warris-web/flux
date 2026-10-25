// const mongoose = require("mongoose");

// const OrderSchema = new mongoose.Schema(
//   {
//     vendor_id: { type: String, required: true },
//     vendor_name: { type: String, required: true },
//     product_name: { type: String, required: true },
//     amount: { type: Number, required: true },
//     product_amount: { type: Number, default: 0 },      
//     delivery_fee: { type: Number, default: 0 },

//     currency: { type: String, default: "NGN" },

//     customer_name: { type: String, required: true },
//     customer_phone: { type: String, required: true },
//     customer_email: { type: String, default: "" },

//     order_mode: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
//     delivery_address: { type: String, default: "" },
//     notes: { type: String, default: "" },

//     receipt_code: { type: String, required: true, unique: true },
//     payment_reference: { type: String, default: "" },
//     status: {
//       type: String,
//       enum: ["pending", "paid", "confirmed", "ready_for_pickup", "delivered", "cancelled"],
//       default: "pending",
//     },

//     created_at: { type: Date, default: Date.now },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", OrderSchema);


const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    vendor_id: { type: String, required: true },
    vendor_name: { type: String, required: true },
    product_name: { type: String, required: true },

    amount: { type: Number, required: true },          // total charged = product_amount + delivery_fee
    product_amount: { type: Number, default: 0 },      // what the vendor earns
    delivery_fee: { type: Number, default: 0 },
    currency: { type: String, default: "NGN" },

    customer_name: { type: String, required: true },
    customer_phone: { type: String, default: "" },
    customer_email: { type: String, default: "" },
    user_id: { type: String, default: "" },            // the logged-in customer who paid

    order_mode: { type: String, enum: ["pickup", "delivery"], default: "pickup" },
    delivery_address: { type: String, default: "" },
    notes: { type: String, default: "" },

    receipt_code: { type: String, required: true, unique: true },
    payment_reference: { type: String, default: "" },
    payment_url: { type: String, default: "" },        // lets a pending order be paid later from history
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