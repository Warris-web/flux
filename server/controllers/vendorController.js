// // const axios  = require("axios");
// // const Vendor = require("../models/Vendor");
// // const User   = require("../models/User");
// // const jwt    = require("jsonwebtoken");

// // const signToken = (id) =>
// //   jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// // exports.registerVendor = async (req, res) => {
// //   try {
// //     const {
// //       pharmacy_name, owner_name, email, phone,
// //       address, city, state, lat, lng, products,
// //     } = req.body;

// //     if (!pharmacy_name || !owner_name || !email || !phone || !address || !city || !state)
// //       return res.status(400).json({ error: "All fields required" });

// //     const exists = await Vendor.findOne({ email });
// //     if (exists) return res.status(400).json({ error: "Email already registered" });

// //     const vendor = await Vendor.create({
// //       pharmacy_name, owner_name, email, phone,
// //       address, city, state,
// //       lat:      lat      || 6.5244,
// //       lng:      lng      || 3.3792,
// //       products: products || [],
// //       status:   "active",
// //     });

// //     // If no Squad keys — return mock
// //     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
// //       return res.json({
// //         success:  true,
// //         mock:     true,
// //         vendor_id: vendor._id,
// //         message:  "Vendor registered. Add Squad keys for live payment.",
// //       });
// //     }

// //     // Initiate Squad payment — ₦10,000 listing fee
// //     const squadRes = await axios.post(
// //       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
// //       {
// //         amount:          1000000,
// //         email:           email,
// //         currency:        "NGN",
// //         initiate_type:   "inline",
// //         transaction_ref: `VV-${vendor._id}`,
// //         callback_url:    "http://localhost:5173/vendor/register?status=success",
// //         pass_charge:     false,
// //         customer_name:   owner_name,
// //       },
// //       {
// //         headers: {
// //           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
// //           "Content-Type": "application/json",
// //         },
// //       }
// //     );

// //     await Vendor.findByIdAndUpdate(vendor._id, {
// //       squad_reference: squadRes.data?.data?.transaction_ref,
// //     });

// //     return res.json({
// //       success:     true,
// //       vendor_id:   vendor._id,
// //       payment_url: squadRes.data?.data?.checkout_url || null,
// //       reference:   squadRes.data?.data?.transaction_ref,
// //     });
// //   } catch (err) {
// //     console.error("Vendor register error:", err.response?.data || err.message);
// //     return res.status(500).json({ error: "Registration failed", detail: err.message });
// //   }
// // };

// // exports.getNearbyVendors = async (req, res) => {
// //   try {
// //     const { city, product } = req.query;

// //     let query = { status: "active" };
// //     if (city)    query.city    = new RegExp(city, "i");
// //     if (product) query.products = { $in: [new RegExp(product, "i")] };

// //     let vendors = await Vendor.find(query).limit(10);

// //     // If no active vendors yet — return demo vendors
// //     if (vendors.length === 0) {
// //       vendors = [
// //         {
// //           _id:           "demo1",
// //           pharmacy_name: "HealthPlus Pharmacy",
// //           owner_name:    "Mr. Adebayo",
// //           address:       "15 Broad Street, Lagos Island",
// //           city:          "Lagos",
// //           state:         "Lagos",
// //           phone:         "08012345678",
// //           products:      ["Coartem", "Vaseline", "Paracetamol"],
// //           lat:            6.4541,
// //           lng:            3.3947,
// //           distance:      "0.8km away",
// //           status:        "active",
// //         },
// //         {
// //           _id:           "demo2",
// //           pharmacy_name: "MedPlus Pharmacy",
// //           owner_name:    "Mrs. Okonkwo",
// //           address:       "42 Allen Avenue, Ikeja",
// //           city:          "Lagos",
// //           state:         "Lagos",
// //           phone:         "08087654321",
// //           products:      ["Coartem", "Artemether"],
// //           lat:            6.6018,
// //           lng:            3.3515,
// //           distance:      "1.4km away",
// //           status:        "active",
// //         },
// //         {
// //           _id:           "demo3",
// //           pharmacy_name: "Kano Central Pharmacy",
// //           owner_name:    "Alhaji Musa",
// //           address:       "7 Bompai Road, Kano",
// //           city:          "Kano",
// //           state:         "Kano",
// //           phone:         "08023456789",
// //           products:      ["Coartem", "Vaseline"],
// //           lat:            12.0022,
// //           lng:            8.5920,
// //           distance:      "1.1km away",
// //           status:        "active",
// //         },
// //       ];
// //     }

// //     return res.json({ success: true, vendors });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };

// // exports.activateVendor = async (req, res) => {
// //   try {
// //     const { vendor_id } = req.body;
// //     const vendor = await Vendor.findByIdAndUpdate(
// //       vendor_id,
// //       { status: "active" },
// //       { new: true }
// //     );
// //     if (!vendor) return res.status(404).json({ error: "Vendor not found" });
// //     return res.json({ success: true, vendor });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };

// // exports.getAllVendors = async (req, res) => {
// //   try {
// //     const vendors = await Vendor.find().sort({ created_at: -1 });
// //     return res.json({ success: true, vendors });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };
// const axios  = require("axios");
// const Vendor = require("../models/Vendor");
// const User   = require("../models/User");

// exports.registerVendor = async (req, res) => {
//   try {
//     const {
//       pharmacy_name, owner_name, email, phone,
//       address, city, state, lat, lng,
//       products, password,
//     } = req.body;

//     if (!pharmacy_name || !owner_name || !email || !phone || !address || !city || !state || !password)
//       return res.status(400).json({ error: "All fields including password are required" });

//     if (password.length < 6)
//       return res.status(400).json({ error: "Password must be at least 6 characters" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ error: "An account with this email already exists. Please login." });

//     const existingVendor = await Vendor.findOne({ email });
//     if (existingVendor)
//       return res.status(400).json({ error: "This pharmacy is already registered. Please login." });

//     // Create vendor
//     const vendor = await Vendor.create({
//       pharmacy_name, owner_name, email, phone,
//       address, city, state,
//       lat:      lat || 6.5244,
//       lng:      lng || 3.3792,
//       products: products || [],
//       status:   "pending",
//     });

//     // Create user account with chosen password
//     await User.create({
//       name:     pharmacy_name,
//       email:    email,
//       password: password,
//       role:     "vendor",
//       ref_id:   vendor._id,
//     });

//     // No Squad keys — activate immediately for dev
//     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
//       await Vendor.findByIdAndUpdate(vendor._id, { status: "active" });
//       return res.json({
//         success:   true,
//         mock:      true,
//         vendor_id: vendor._id,
//         payment_url: null,
//       });
//     }

//     // Squad payment — ₦10,000 listing fee
//     const squadRes = await axios.post(
//       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
//       {
//         amount:          "1000000",
//         email:           email,
//         currency:        "NGN",
//         initiate_type:   "inline",
//         transaction_ref: `VV-${vendor._id}`,
//         callback_url:    `${process.env.CLIENT_URL || "http://localhost:5173"}/vendor/register?status=success`,
        
//         pass_charge:     false,
//         customer_name:   owner_name,
//       },
//       {
//         headers: {
//           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     await Vendor.findByIdAndUpdate(vendor._id, {
//       squad_reference: squadRes.data?.data?.transaction_ref,
//     });

//     return res.json({
//       success:     true,
//       vendor_id:   vendor._id,
//       payment_url: squadRes.data?.data?.checkout_url || null,
//       reference:   squadRes.data?.data?.transaction_ref,
//     });

//   } catch (err) {
//     console.error("Vendor register error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Registration failed", detail: err.message });
//   }
// };

// exports.getNearbyVendors = async (req, res) => {
//   try {
//     const { city, product } = req.query;
//     let query = { status: "active" };
//     if (city)    query.city = new RegExp(city, "i");
//     if (product) query["products.name"] = { $in: [new RegExp(product, "i")] };

//     let vendors = await Vendor.find(query).limit(10);

//     if (vendors.length === 0) {
//       vendors = [
//         { _id: "demo1", pharmacy_name: "HealthPlus Pharmacy", owner_name: "Mr. Adebayo", address: "15 Broad Street, Lagos Island", city: "Lagos", state: "Lagos", phone: "08012345678", products: [{ name: "Coartem", price: 4500, in_stock: true }, { name: "Vaseline", price: 1200, in_stock: true }], status: "active", distance: "0.8km" },
//         { _id: "demo2", pharmacy_name: "MedPlus Pharmacy",    owner_name: "Mrs. Okonkwo", address: "42 Allen Avenue, Ikeja",        city: "Lagos", state: "Lagos", phone: "08087654321", products: [{ name: "Coartem", price: 4200, in_stock: true }, { name: "Artemether", price: 3800, in_stock: false }], status: "active", distance: "1.4km" },
//         { _id: "demo3", pharmacy_name: "Kano Central Pharmacy", owner_name: "Alhaji Musa", address: "7 Bompai Road, Kano",          city: "Kano",  state: "Kano",  phone: "08023456789", products: [{ name: "Coartem", price: 4800, in_stock: true }, { name: "Vaseline", price: 1100, in_stock: true }], status: "active", distance: "1.1km" },
//       ];
//     }

//     return res.json({ success: true, vendors });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// // exports.getMyVendorProfile = async (req, res) => {
// //   try {
// //     const vendor = await Vendor.findById(req.user.ref_id);
// //     if (!vendor) return res.status(404).json({ error: "Vendor profile not found" });
// //     return res.json({ success: true, vendor });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };

// // exports.updateProducts = async (req, res) => {
// //   try {
// //     const { products } = req.body;
// //     const vendor = await Vendor.findByIdAndUpdate(
// //       req.user.ref_id,
// //       { products },
// //       { new: true }
// //     );
// //     return res.json({ success: true, vendor });
// //   } catch (err) {
// //     return res.status(500).json({ error: err.message });
// //   }
// // };


// exports.getMyVendorProfile = async (req, res) => {
//   try {
//     // Try ref_id first, then fall back to email match
//     let vendor = req.user.ref_id
//       ? await Vendor.findById(req.user.ref_id)
//       : await Vendor.findOne({ email: req.user.email });

//     if (!vendor) return res.status(404).json({ error: "Vendor profile not found" });
//     return res.json({ success: true, vendor });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// exports.updateProducts = async (req, res) => {
//   try {
//     const { products } = req.body;

//     let vendor = req.user.ref_id
//       ? await Vendor.findById(req.user.ref_id)
//       : await Vendor.findOne({ email: req.user.email });

//     if (!vendor) return res.status(404).json({ error: "Vendor not found" });

//     vendor = await Vendor.findByIdAndUpdate(
//       vendor._id,
//       { products },
//       { new: true }
//     );
//     return res.json({ success: true, vendor });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// exports.activateVendor = async (req, res) => {
//   try {
//     const { vendor_id } = req.body;
//     const vendor = await Vendor.findByIdAndUpdate(vendor_id, { status: "active" }, { new: true });
//     if (!vendor) return res.status(404).json({ error: "Vendor not found" });
//     return res.json({ success: true, vendor });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// exports.getAllVendors = async (req, res) => {
//   try {
//     const vendors = await Vendor.find().sort({ created_at: -1 });
//     return res.json({ success: true, vendors });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };

// exports.payVendor = async (req, res) => {
//   try {
//     const { vendor_id, product_name, amount, customer_email } = req.body;

//     if (!vendor_id || !product_name || !amount)
//       return res.status(400).json({ error: "vendor_id, product_name and amount required" });

//     const vendor = await Vendor.findById(vendor_id);
//     if (!vendor) return res.status(404).json({ error: "Vendor not found" });

//     // Generate unique receipt code
//     const receipt_code = `VS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2,6).toUpperCase()}`;

//     // No Squad keys — mock receipt
//     if (!process.env.SQUAD_SECRET_KEY || process.env.SQUAD_SECRET_KEY.trim() === "") {
//       return res.json({
//         success:      true,
//         mock:         true,
//         receipt_code,
//         payment_url:  null,
//         vendor_name:  vendor.pharmacy_name,
//         product_name,
//         amount,
//       });
//     }

//     // Initiate Squad payment to vendor
//     const squadRes = await axios.post(
//       `${process.env.SQUAD_BASE_URL}/transaction/initiate`,
//       {
//         amount:          String(amount * 100), // kobo
//         email:           customer_email || "customer@verascann.com",
//         currency:        "NGN",
//         initiate_type:   "inline",
//         transaction_ref: receipt_code,
//         pass_charge:     false,
//         customer_name:   "VeraScann Customer",
//         metadata: {
//           vendor_id,
//           vendor_name:  vendor.pharmacy_name,
//           product_name,
//           receipt_code,
//         },
//         callback_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/vendor/locator?payment=success&code=${receipt_code}&product=${encodeURIComponent(product_name || "")}`,
//       },
//       {
//         headers: {
//           Authorization:  `Bearer ${process.env.SQUAD_SECRET_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return res.json({
//       success:      true,
//       receipt_code,
//       payment_url:  squadRes.data?.data?.checkout_url || null,
//       vendor_name:  vendor.pharmacy_name,
//       product_name,
//       amount,
//     });
//   } catch (err) {
//     console.error("Pay vendor error:", err.response?.data || err.message);
//     return res.status(500).json({ error: "Payment initiation failed" });
//   }
// };

// exports.activateByReference = async (req, res) => {
//   try {
//     const { reference } = req.body;
//     if (!reference)
//       return res.status(400).json({ error: "Reference required" });

//     // Reference format is VV-{vendorId}
//     const vendorId = reference.replace("VV-", "").split("?")[0];

//     const vendor = await Vendor.findByIdAndUpdate(
//       vendorId,
//       { status: "active", squad_reference: reference },
//       { new: true }
//     );

//     if (!vendor)
//       return res.status(404).json({ error: "Vendor not found" });

//     return res.json({ success: true, vendor });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// };



const axios = require("axios");
const Vendor = require("../models/Vendor");
const User = require("../models/User");

exports.registerVendor = async (req, res) => {
  try {
    const {
      pharmacy_name,
      owner_name,
      email,
      phone,
      address,
      city,
      state,
      lat,
      lng,
      products,
      password,
    } = req.body;

    if (!pharmacy_name || !owner_name || !email || !phone || !address || !city || !state || !password)
      return res.status(400).json({ error: "All fields including password are required" });

    if (password.length < 6)
      return res.status(400).json({ error: "Password must be at least 6 characters" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "An account with this email already exists. Please login." });

    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor)
      return res.status(400).json({ error: "This pharmacy is already registered. Please login." });

    const vendor = await Vendor.create({
      pharmacy_name,
      owner_name,
      email,
      phone,
      address,
      city,
      state,
      lat: lat || 6.5244,
      lng: lng || 3.3792,
      products: products || [],
      status: "pending",
    });

    await User.create({
      name: pharmacy_name,
      email,
      password,
      role: "vendor",
      ref_id: vendor._id,
    });

    if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.trim() === "") {
      await Vendor.findByIdAndUpdate(vendor._id, { status: "active" });
      return res.json({
        success: true,
        mock: true,
        vendor_id: vendor._id,
        payment_url: null,
      });
    }

    const paystackRes = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount: "1000000",
        email,
        currency: "NGN",
        reference: `VV-${vendor._id}`,
        callback_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/vendor/register?status=success`,
        metadata: {
          vendor_id: vendor._id,
          vendor_name: pharmacy_name,
        },
        customer: {
          email,
          name: owner_name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await Vendor.findByIdAndUpdate(vendor._id, {
      paystack_reference: paystackRes.data?.data?.reference,
    });

    return res.json({
      success: true,
      vendor_id: vendor._id,
      payment_url: paystackRes.data?.data?.authorization_url || null,
      reference: paystackRes.data?.data?.reference,
    });
  } catch (err) {
    console.error("Vendor register error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Registration failed", detail: err.message });
  }
};

exports.getNearbyVendors = async (req, res) => {
  try {
    const { city, product } = req.query;
    let query = { status: "active" };
    if (city) query.city = new RegExp(city, "i");
    if (product) query["products.name"] = { $in: [new RegExp(product, "i")] };

    let vendors = await Vendor.find(query).limit(10);

    if (vendors.length === 0) {
      vendors = [
        { _id: "demo1", pharmacy_name: "HealthPlus Pharmacy", owner_name: "Mr. Adebayo", address: "15 Broad Street, Lagos Island", city: "Lagos", state: "Lagos", phone: "08012345678", products: ["Coartem", "Vaseline", "Paracetamol"], lat: 6.4541, lng: 3.3947, distance: "0.8km away", status: "active" },
        { _id: "demo2", pharmacy_name: "MedPlus Pharmacy", owner_name: "Mrs. Okonkwo", address: "42 Allen Avenue, Ikeja", city: "Lagos", state: "Lagos", phone: "08087654321", products: ["Coartem", "Artemether"], lat: 6.6018, lng: 3.3515, distance: "1.4km away", status: "active" },
        { _id: "demo3", pharmacy_name: "Kano Central Pharmacy", owner_name: "Alhaji Musa", address: "7 Bompai Road, Kano", city: "Kano", state: "Kano", phone: "08023456789", products: ["Coartem", "Vaseline"], lat: 12.0022, lng: 8.592, distance: "1.1km away", status: "active" },
      ];
    }

    return res.json({ success: true, vendors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getMyVendorProfile = async (req, res) => {
  try {
    let vendor = req.user.ref_id
      ? await Vendor.findById(req.user.ref_id)
      : await Vendor.findOne({ email: req.user.email });

    if (!vendor) return res.status(404).json({ error: "Vendor profile not found" });
    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateProducts = async (req, res) => {
  try {
    const { products } = req.body;

    let vendor = req.user.ref_id
      ? await Vendor.findById(req.user.ref_id)
      : await Vendor.findOne({ email: req.user.email });

    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    vendor = await Vendor.findByIdAndUpdate(vendor._id, { products }, { new: true });
    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.activateVendor = async (req, res) => {
  try {
    const { vendor_id } = req.body;
    const vendor = await Vendor.findByIdAndUpdate(vendor_id, { status: "active" }, { new: true });
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });
    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ created_at: -1 });
    return res.json({ success: true, vendors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.payVendor = async (req, res) => {
  try {
    const { vendor_id, product_name, amount, customer_email } = req.body;

    if (!vendor_id || !product_name || !amount)
      return res.status(400).json({ error: "vendor_id, product_name and amount required" });

    const vendor = await Vendor.findById(vendor_id);
    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const receipt_code = `VS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    if (!process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_SECRET_KEY.trim() === "") {
      return res.json({
        success: true,
        mock: true,
        receipt_code,
        payment_url: null,
        vendor_name: vendor.pharmacy_name,
        product_name,
        amount,
      });
    }

    const paystackRes = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        amount: String(amount * 100),
        email: customer_email || "customer@verascann.com",
        currency: "NGN",
        reference: receipt_code,
        pass_charge: false,
        customer: {
          email: customer_email || "customer@verascann.com",
          name: "VeraScann Customer",
        },
        metadata: {
          vendor_id,
          vendor_name: vendor.pharmacy_name,
          product_name,
          receipt_code,
        },
        callback_url: `${process.env.CLIENT_URL || "http://localhost:5173"}/vendor/locator?payment=success&code=${receipt_code}&product=${encodeURIComponent(product_name || "")}`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.json({
      success: true,
      receipt_code,
      payment_url: paystackRes.data?.data?.authorization_url || null,
      vendor_name: vendor.pharmacy_name,
      product_name,
      amount,
    });
  } catch (err) {
    console.error("Pay vendor error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Payment initiation failed" });
  }
};

exports.activateByReference = async (req, res) => {
  try {
    const { reference } = req.body;
    if (!reference)
      return res.status(400).json({ error: "Reference required" });

    const vendorId = reference.replace("VV-", "").split("?")[0];

    const vendor = await Vendor.findByIdAndUpdate(
      vendorId,
      { status: "active", paystack_reference: reference },
      { new: true }
    );

    if (!vendor)
      return res.status(404).json({ error: "Vendor not found" });

    return res.json({ success: true, vendor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
