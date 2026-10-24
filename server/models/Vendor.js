// // const mongoose = require("mongoose");

// // const VendorSchema = new mongoose.Schema({
// //   pharmacy_name:  { type: String, required: true },
// //   owner_name:     { type: String, required: true },
// //   email:          { type: String, required: true, unique: true },
// //   phone:          { type: String, required: true },
// //   address:        { type: String, required: true },
// //   city:           { type: String, required: true },
// //   state:          { type: String, required: true },
// //   lat:            { type: Number },
// //   lng:            { type: Number },
// //   products:       [{ type: String }],
// //   squad_reference:{ type: String },
// //   status:         { type: String, enum: ["pending", "active"], default: "pending" },
// //   created_at:     { type: Date, default: Date.now },
// // });

// // module.exports = mongoose.model("Vendor", VendorSchema);
// const mongoose = require("mongoose");

// const ProductItemSchema = new mongoose.Schema({
//   name:     { type: String, required: true },
//   price:    { type: Number, required: true },
//   in_stock: { type: Boolean, default: true },
// });

// const VendorSchema = new mongoose.Schema({
//   pharmacy_name:   { type: String, required: true },
//   owner_name:      { type: String, required: true },
//   email:           { type: String, required: true, unique: true },
//   phone:           { type: String, required: true },
//   address:         { type: String, required: true },
//   city:            { type: String, required: true },
//   state:           { type: String, required: true },
//   lat:             { type: Number, default: 6.5244 },
//   lng:             { type: Number, default: 3.3792 },
//   products:        [ProductItemSchema],
//   squad_reference: { type: String },
//   status:          { type: String, enum: ["pending", "active"], default: "pending" },
//   orders_count:    { type: Number, default: 0 },
//   revenue:         { type: Number, default: 0 },
//   created_at:      { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Vendor", VendorSchema);

const mongoose = require("mongoose");

const ProductItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  in_stock: { type: Boolean, default: true },
});

const VendorSchema = new mongoose.Schema({
  pharmacy_name: { type: String, required: true },
  owner_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  lat: { type: Number, default: 6.5244 },
  lng: { type: Number, default: 3.3792 },
  products: [ProductItemSchema],
  paystack_reference: { type: String },
  status: { type: String, enum: ["pending", "active"], default: "pending" },
  orders_count: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vendor", VendorSchema);
