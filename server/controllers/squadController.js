// const crypto = require("crypto");
// const BrandRegistration = require("../models/BrandRegistration");

// exports.handleWebhook = async (req, res) => {
//   try {
//     // Verify Squad webhook signature
//     const squadSignature = req.headers["x-squad-encrypted-body"];
//     const payload        = JSON.stringify(req.body);
//     const hash           = crypto
//       .createHmac("sha512", process.env.SQUAD_SECRET_KEY)
//       .update(payload)
//       .digest("hex")
//       .toUpperCase();

//     if (squadSignature && hash !== squadSignature) {
//       console.warn("Invalid Squad webhook signature");
//       return res.status(401).json({ error: "Invalid signature" });
//     }

//     const { Event, Body } = req.body;

//     if (Event === "charge_successful") {
//       const ref     = Body?.transaction_ref || "";
//       const brandId = ref.replace("VS-", "");

//       if (brandId) {
//         await BrandRegistration.findByIdAndUpdate(brandId, {
//           status:          "active",
//           squad_reference: ref,
//         });
//         console.log(`Brand ${brandId} activated via Squad webhook`);
//       }
//     }

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Webhook error:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };

// const crypto  = require("crypto");
// const BrandRegistration = require("../models/BrandRegistration");
// const Vendor  = require("../models/Vendor");

// exports.handleWebhook = async (req, res) => {
//   try {
//     const squadSignature = req.headers["x-squad-encrypted-body"];
//     const payload        = JSON.stringify(req.body);
//     const hash           = crypto
//       .createHmac("sha512", process.env.SQUAD_SECRET_KEY)
//       .update(payload)
//       .digest("hex")
//       .toUpperCase();

//     if (squadSignature && hash !== squadSignature) {
//       console.warn("Invalid Squad webhook signature");
//       return res.status(401).json({ error: "Invalid signature" });
//     }

//     const { Event, Body } = req.body;

//     if (Event === "charge_successful") {
//       const ref = Body?.transaction_ref || "";

//       // Brand payment — ref starts with VS-
//       if (ref.startsWith("VS-")) {
//         const brandId = ref.replace("VS-", "");
//         await BrandRegistration.findByIdAndUpdate(brandId, {
//           status: "active", squad_reference: ref,
//         });
//         console.log(`Brand ${brandId} activated`);
//       }

//       // Vendor payment — ref starts with VV-
//       if (ref.startsWith("VV-")) {
//         const vendorId = ref.replace("VV-", "");
//         await Vendor.findByIdAndUpdate(vendorId, {
//           status: "active", squad_reference: ref,
//         });
//         console.log(`Vendor ${vendorId} activated`);
//       }
//     }

//     return res.status(200).json({ success: true });
//   } catch (err) {
//     console.error("Webhook error:", err.message);
//     return res.status(500).json({ error: err.message });
//   }
// };




const crypto = require("crypto");
const BrandRegistration = require("../models/BrandRegistration");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");
const { markOrderPaid } = require("../utils/orderPayment");


exports.handleWebhook = async (req, res) => {
  try {
    const paystackSignature = req.headers["x-paystack-signature"];
    const payload = JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(payload)
      .digest("hex");

    if (paystackSignature && hash !== paystackSignature) {
      console.warn("Invalid Paystack webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body?.event;
    const data = req.body?.data || {};
    const ref = data?.reference || "";

       

              if (event === "charge.success" || event === "transaction.success") {
      if (await Order.exists({ receipt_code: ref })) {
        await markOrderPaid(ref, ref);
        return res.status(200).json({ success: true });
      }

     


      // Customer order payment (atomic: only first webhook flips pending → paid)
      const order = await Order.findOneAndUpdate(
        { receipt_code: ref, status: "pending" },
        { status: "paid", payment_reference: ref },
        { new: true }
      );
      if (order) {
        await Vendor.findByIdAndUpdate(order.vendor_id, {
          $inc: { orders_count: 1, revenue: order.product_amount }, // product only, not delivery
        });
        return res.status(200).json({ success: true });
      }

      if (ref.startsWith("VS-")) {
       
        const brandId = ref.replace("VS-", "");
        await BrandRegistration.findByIdAndUpdate(brandId, {
          status: "active",
          paystack_reference: ref,
        });
        console.log(`Brand ${brandId} activated via Paystack webhook`);
      }

      if (ref.startsWith("VV-")) {
        const vendorId = ref.replace("VV-", "");
        await Vendor.findByIdAndUpdate(vendorId, {
          status: "active",
          paystack_reference: ref,
        });
        console.log(`Vendor ${vendorId} activated via Paystack webhook`);
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(500).json({ error: err.message });
  }
};
