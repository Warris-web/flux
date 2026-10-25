

// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import { useAuth } from "../context/AuthContext";
// import ReceiptModal from "../components/ReceiptModal";
// import { fromApi, naira } from "../utils/receipt";
// import { addOrderCode, saveCustomer, getCustomer } from "../utils/orderStorage";

// const API = import.meta.env.VITE_API_URL;

// export default function VendorLocatorPage() {
//   const [searchParams] = useSearchParams();
//   const navigate       = useNavigate();
//   const location       = useLocation();
//   const { user }       = useAuth();   // logged-in customer: name/email come from here
//   const product        = searchParams.get("product") || "Coartem";
//   const city           = searchParams.get("city")    || "Lagos";

//   const [vendors,  setVendors]  = useState([]);
//   const [loading,  setLoading]  = useState(true);
//   const [selected, setSelected] = useState(null);
//   const [selProd,  setSelProd]  = useState(null);
//   const [receipt,  setReceipt]  = useState(null);
//   const [paying,   setPaying]   = useState(false);
//   const [checking, setChecking] = useState(false);

//   // only the pickup/delivery choice + delivery address are asked now
//   const [orderForm, setOrderForm] = useState(() => ({
//     mode: "pickup",
//     delivery_address: getCustomer().delivery_address || "",
//   }));

//   // ── derived totals (display only — the server recalculates the real amount) ──
//   const deliveryFee = orderForm.mode === "delivery" ? Number(selProd?.delivery_fee || 0) : 0;
//   const totalToPay  = Number(selProd?.price || 0) + deliveryFee;

//   useEffect(() => {
//     axios.get(`${API}/api/vendors/nearby`, { params: { city, product } })
//       .then(r => setVendors(r.data.vendors))
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   // ── user comes back from Paystack: ?payment=success&code=VS-XXXX ──
//   const loadReceipt = async (code) => {
//     const { data } = await axios.get(`${API}/api/orders/receipt/${encodeURIComponent(code)}`);
//     setReceipt(fromApi(data.order));
//     addOrderCode(code);
//   };

//   useEffect(() => {
//     const payment = searchParams.get("payment");
//     const code    = searchParams.get("code");
//     if (payment === "success" && code) {
//       loadReceipt(code).catch(() => alert("Payment received, but we couldn't load your receipt. Check My Orders."));
//     }
//   }, []);

//   const refreshReceipt = async () => {
//     if (!receipt) return;
//     setChecking(true);
//     try { await loadReceipt(receipt.code); }
//     catch { alert("Couldn't check payment status. Try again."); }
//     finally { setChecking(false); }
//   };

//   const initiatePayment = async (vendor, prod) => {
//     if (["demo1", "demo2", "demo3"].includes(vendor._id))
//       return alert("This is a demo vendor. Payments work with registered vendors only.");
//     if (!user) {
//       // not logged in -> send to login, then come back to this exact page
//       return navigate("/login", { state: { from: location.pathname + location.search } });
//     }
//     if (orderForm.mode === "delivery" && !orderForm.delivery_address.trim())
//       return alert("Enter your delivery address");

//     setPaying(true);
//     try {
//       const { data } = await axios.post(`${API}/api/vendors/pay`, {
//         vendor_id:        vendor._id,
//         product_name:     prod.name,
//         order_mode:       orderForm.mode,
//         delivery_address: orderForm.mode === "delivery" ? orderForm.delivery_address : "",
//         // name + email are taken from the logged-in account on the server
//       });

//       // keep it in this device's history straight away (shows as "Awaiting payment")
//       addOrderCode(data.receipt_code);
//       saveCustomer(orderForm);

//       setReceipt({
//         code:            data.receipt_code,
//         status:          data.mock ? "paid" : "pending",
//         mode:            data.order_mode,
//         product:         data.product_name,
//         productAmount:   data.product_amount,
//         deliveryFee:     data.delivery_fee,
//         total:           data.total_amount,
//         vendor:          vendor.pharmacy_name,
//         address:         vendor.address,
//         phone:           vendor.phone,
//         customerName:    user.name,
//         deliveryAddress: orderForm.mode === "delivery" ? orderForm.delivery_address : "",
//         date:            new Date().toISOString(),
//         paymentUrl:      data.payment_url || null,
//       });

//       setSelected(null);
//       setSelProd(null);
//     } catch (err) {
//       alert(err.response?.data?.error || "Payment failed. Please try again.");
//     } finally { setPaying(false); }
//   };

//   const inputStyle = { background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit" };

//   return (
//     <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>

//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
//         <button onClick={() => navigate(-1)} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
//           ← Back
//         </button>
//         <div style={{ flex: 1 }}>
//           <div style={{ fontSize: 11, color: "#E53935", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Counterfeit Detected</div>
//           <div style={{ fontSize: 18, fontWeight: 700 }}>Buy Genuine {product} Near You</div>
//           <div style={{ fontSize: 12, color: "#555" }}>Mantios-verified vendors in {city}</div>
//         </div>
//         <button onClick={() => navigate("/orders")} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#E5391F", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
//           My Orders
//         </button>
//       </div>

//       {/* Alert */}
//       <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
//         <div style={{ fontSize: 20 }}>⚠</div>
//         <div style={{ fontSize: 12, color: "#999" }}>
//           The <strong style={{ color: "#fff" }}>{product}</strong> you scanned was flagged as{" "}
//           <strong style={{ color: "#E53935" }}>COUNTERFEIT</strong>. Purchase from a verified vendor below.
//           Pay via Paystack, choose pickup or delivery, and download your receipt.
//         </div>
//       </div>

//       {/* Receipt modal */}
//       <ReceiptModal
//         receipt={receipt}
//         checking={checking}
//         onRefresh={refreshReceipt}
//         onClose={() => setReceipt(null)}
//       />

//       {/* Content */}
//       {loading ? (
//         <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Finding verified vendors...</div>
//       ) : vendors.length === 0 ? (
//         <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center" }}>
//           <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
//           <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No verified vendors in {city} yet</div>
//           <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Know a vendor? Help build the network.</div>
//           <button onClick={() => navigate("/vendor/register")} style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//             Refer a Vendor →
//           </button>
//         </div>
//       ) : (
//         <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//           {vendors.map((vendor, i) => (
//             <div key={i} style={{ background: "#141414", border: `1px solid ${selected?._id === vendor._id ? "#E5391F" : "#2A2A2A"}`, borderRadius: 12, padding: "20px", transition: "border-color 0.2s" }}>

//               {/* Vendor info */}
//               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
//                 <div>
//                   <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
//                     <div style={{ fontSize: 16, fontWeight: 700 }}>{vendor.pharmacy_name}</div>
//                     <span style={{ fontSize: 9, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "2px 6px" }}>VERIFIED</span>
//                   </div>
//                   <div style={{ fontSize: 12, color: "#666" }}>{vendor.address}</div>
//                   <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>📞 {vendor.phone}</div>
//                 </div>
//                 <div style={{ fontSize: 13, color: "#E5391F", fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
//                   {vendor.distance || `${(i * 0.6 + 0.8).toFixed(1)}km away`}
//                 </div>
//               </div>

//               {/* Products */}
//               <div style={{ marginBottom: 14 }}>
//                 <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
//                   Available Products — tap to select & pay
//                 </div>
//                 {(!vendor.products || vendor.products.length === 0) ? (
//                   <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>No products listed yet</div>
//                 ) : (
//                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
//                     {vendor.products.map((p, j) => {
//                       const pName      = typeof p === "string" ? p : (p?.name || "");
//                       const pPrice     = typeof p === "string" ? 0 : (p?.price || 0);
//                       const pDelivery  = typeof p === "string" ? 0 : (p?.delivery_fee || 0);
//                       const pInStock   = typeof p === "string" ? true : (p?.in_stock !== false);
//                       const isTarget   = pName.toLowerCase().includes(product.toLowerCase());
//                       const isSelected = selected?._id === vendor._id && selProd?.name === pName;

//                       return (
//                         <div key={j}
//                           onClick={() => pInStock ? (setSelected(vendor), setSelProd({ name: pName, price: pPrice, delivery_fee: pDelivery, in_stock: pInStock })) : null}
//                           style={{
//                             background:  isSelected ? "rgba(229,57,31,0.08)" : "#111",
//                             border:     `1px solid ${isSelected ? "#E5391F" : isTarget ? "rgba(229,57,31,0.25)" : "#222"}`,
//                             borderRadius: 8, padding: "12px 14px",
//                             cursor:      pInStock ? "pointer" : "not-allowed",
//                             opacity:     pInStock ? 1 : 0.5,
//                             transition:  "all 0.2s",
//                           }}>
//                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
//                             <div style={{ fontSize: 13, fontWeight: 500, color: isTarget ? "#E5391F" : "#fff" }}>{pName}</div>
//                             {isTarget && (
//                               <span style={{ fontSize: 9, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 3, padding: "1px 5px", flexShrink: 0, marginLeft: 6 }}>Match</span>
//                             )}
//                           </div>
//                           <div style={{ fontSize: 17, fontWeight: 700, color: "#E5391F", marginBottom: 4 }}>
//                             {pPrice > 0 ? naira(pPrice) : "Call for price"}
//                           </div>
//                           <div style={{ fontSize: 10, fontWeight: 600, color: pInStock ? "#43A047" : "#E53935" }}>
//                             {pInStock ? "✓ In Stock" : "Out of Stock"}
//                           </div>
//                           {isSelected && (
//                             <div style={{ marginTop: 6, fontSize: 10, color: "#E5391F", fontWeight: 600 }}>✓ Selected</div>
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>

//               {/* Pay section — only when a product is selected from THIS vendor */}
//               {selected?._id === vendor._id && selProd && (
//                 <div style={{ background: "rgba(229,57,31,0.05)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 10, padding: "14px 16px" }}>
//                   <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Pay for {selProd.name}</div>
//                   <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>at {vendor.pharmacy_name} · Secured by Paystack</div>

//                   {/* Pickup / Delivery */}
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
//                     {[
//                       { key: "pickup",   title: "Pickup",   sub: "Collect from vendor", fee: 0 },
//                       { key: "delivery", title: "Delivery", sub: "To your address",     fee: selProd.delivery_fee || 0 },
//                     ].map(o => {
//                       const active = orderForm.mode === o.key;
//                       return (
//                         <button key={o.key} type="button"
//                           onClick={() => setOrderForm(f => ({ ...f, mode: o.key }))}
//                           style={{
//                             background: active ? "rgba(229,57,31,0.08)" : "#0A0A0A",
//                             border: `1px solid ${active ? "rgba(229,57,31,0.4)" : "#2A2A2A"}`,
//                             borderRadius: 10, padding: "12px 14px", color: "#fff", cursor: "pointer",
//                             textAlign: "left", fontFamily: "inherit",
//                           }}>
//                           <div style={{ fontSize: 13, fontWeight: 600 }}>{o.title}</div>
//                           <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{o.sub}</div>
//                           <div style={{ fontSize: 12, fontWeight: 600, color: active ? "#E5391F" : "#fff", marginTop: 6 }}>
//                             {o.fee > 0 ? `+${naira(o.fee)}` : "Free"}
//                           </div>
//                         </button>
//                       );
//                     })}
//                   </div>

//                   {/* Customer details */}
//                   <div style={{ display: "grid", gap: 8, marginBottom: orderForm.mode === "delivery" ? 12 : 0 }}>
//                     {orderForm.mode === "delivery" && (
//                       <textarea placeholder="Delivery address" rows={2} value={orderForm.delivery_address}
//                         onChange={e => setOrderForm(f => ({ ...f, delivery_address: e.target.value }))}
//                         style={{ ...inputStyle, resize: "none" }} />
//                     )}
//                   </div>

//                   {/* Summary */}
//                   <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: 10, marginBottom: 12, fontSize: 12 }}>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#999" }}>
//                       <span>Product</span><span>{naira(selProd.price)}</span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#999" }}>
//                       <span>Delivery fee</span><span>{deliveryFee > 0 ? naira(deliveryFee) : "Free"}</span>
//                     </div>
//                     <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
//                       <span>Total</span><span style={{ color: "#E5391F" }}>{naira(totalToPay)}</span>
//                     </div>
//                   </div>

//                   <div style={{ display: "flex", gap: 10 }}>
//                     <button
//                       onClick={() => { setSelected(null); setSelProd(null); }}
//                       style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => initiatePayment(vendor, selProd)}
//                       disabled={paying || selProd.price <= 0}
//                       style={{ flex: 1, background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: paying ? 0.7 : 1 }}>
//                       {paying ? "Processing..." : selProd.price > 0 ? `Pay ${naira(totalToPay)} via Paystack →` : "Call for price"}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               {/* Call button — when nothing selected */}
//               {!(selected?._id === vendor._id && selProd) && (
//                 <a href={`tel:${vendor.phone}`}
//                   style={{ display: "block", background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px", fontSize: 12, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
//                   📞 Call Vendor
//                 </a>
//               )}
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Bottom CTA */}
//       <div style={{ marginTop: 24, background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//         <div>
//           <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Sell genuine products?</div>
//           <div style={{ fontSize: 11, color: "#555" }}>Join the Mantios network. Get customers directed to you when fakes are detected nearby.</div>
//         </div>
//         <button
//           onClick={() => navigate("/vendor/register")}
//           style={{ background: "transparent", color: "#E5391F", border: "1px solid rgba(229,57,31,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 16 }}>
//           Join Network →
//         </button>
//       </div>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import ReceiptModal from "../components/ReceiptModal";
import { fromApi, naira } from "../utils/receipt";
import { addOrderCode, saveCustomer, getCustomer } from "../utils/orderStorage";

const API = import.meta.env.VITE_API_URL;

export default function VendorLocatorPage() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const location       = useLocation();
  const { user }       = useAuth();   // logged-in customer: name/email come from here
  const product        = searchParams.get("product") || "Coartem";
  const city           = searchParams.get("city")    || "Lagos";

  const [vendors,  setVendors]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [selProd,  setSelProd]  = useState(null);
  const [receipt,  setReceipt]  = useState(null);
  const [paying,   setPaying]   = useState(false);
  const [checking, setChecking] = useState(false);

  // only the pickup/delivery choice + delivery address are asked now
  const [orderForm, setOrderForm] = useState(() => ({
    mode: "pickup",
    delivery_address: getCustomer().delivery_address || "",
  }));

  // ── derived totals (display only — the server recalculates the real amount) ──
  const deliveryFee = orderForm.mode === "delivery" ? Number(selProd?.delivery_fee || 0) : 0;
  const totalToPay  = Number(selProd?.price || 0) + deliveryFee;

  useEffect(() => {
    axios.get(`${API}/api/vendors/nearby`, { params: { city, product } })
      .then(r => setVendors(r.data.vendors))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── user comes back from Paystack: ?payment=success&code=VS-XXXX ──
  const loadReceipt = async (code) => {
    const { data } = await axios.get(`${API}/api/orders/receipt/${encodeURIComponent(code)}`);
    setReceipt(fromApi(data.order));
    addOrderCode(code);
  };

  useEffect(() => {
    const payment = searchParams.get("payment");
    const code    = searchParams.get("code");
    if (payment === "success" && code) {
      loadReceipt(code).catch(() => alert("Payment received, but we couldn't load your receipt. Check My Orders."));
    }
  }, []);

  const refreshReceipt = async () => {
    if (!receipt) return;
    setChecking(true);
    try { await loadReceipt(receipt.code); }
    catch { alert("Couldn't check payment status. Try again."); }
    finally { setChecking(false); }
  };

  const initiatePayment = async (vendor, prod) => {
    if (["demo1", "demo2", "demo3"].includes(vendor._id))
      return alert("This is a demo vendor. Payments work with registered vendors only.");
    if (!user) {
      // not logged in -> send to login, then come back to this exact page
      return navigate("/login", { state: { from: location.pathname + location.search } });
    }
    if (orderForm.mode === "delivery" && !orderForm.delivery_address.trim())
      return alert("Enter your delivery address");

    setPaying(true);
    try {
      const { data } = await axios.post(`${API}/api/vendors/pay`, {
        vendor_id:        vendor._id,
        product_name:     prod.name,
        order_mode:       orderForm.mode,
        delivery_address: orderForm.mode === "delivery" ? orderForm.delivery_address : "",
        // name + email are taken from the logged-in account on the server
      });

      // keep it in this device's history straight away (shows as "Awaiting payment")
      addOrderCode(data.receipt_code);
      saveCustomer(orderForm);

      // go straight to Paystack — no pending receipt shown before payment
      if (data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }

      setReceipt({
        code:            data.receipt_code,
        status:          data.mock ? "paid" : "pending",
        mode:            data.order_mode,
        product:         data.product_name,
        productAmount:   data.product_amount,
        deliveryFee:     data.delivery_fee,
        total:           data.total_amount,
        vendor:          vendor.pharmacy_name,
        address:         vendor.address,
        phone:           vendor.phone,
        customerName:    user.name,
        deliveryAddress: orderForm.mode === "delivery" ? orderForm.delivery_address : "",
        date:            new Date().toISOString(),
        paymentUrl:      data.payment_url || null,
      });

      setSelected(null);
      setSelProd(null);
    } catch (err) {
      alert(err.response?.data?.error || "Payment failed. Please try again.");
    } finally { setPaying(false); }
  };

  const inputStyle = { background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 6, padding: "9px 12px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit" };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: "#E53935", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>Counterfeit Detected</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Buy Genuine {product} Near You</div>
          <div style={{ fontSize: 12, color: "#555" }}>Mantios-verified vendors in {city}</div>
        </div>
        <button onClick={() => navigate("/orders")} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#E5391F", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          My Orders
        </button>
      </div>

      {/* Alert */}
      <div style={{ background: "rgba(229,57,53,0.05)", border: "1px solid rgba(229,57,53,0.2)", borderRadius: 10, padding: "12px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ fontSize: 20 }}>⚠</div>
        <div style={{ fontSize: 12, color: "#999" }}>
          The <strong style={{ color: "#fff" }}>{product}</strong> you scanned was flagged as{" "}
          <strong style={{ color: "#E53935" }}>COUNTERFEIT</strong>. Purchase from a verified vendor below.
          Pay via Paystack, choose pickup or delivery, and download your receipt.
        </div>
      </div>

      {/* Receipt modal */}
      <ReceiptModal
        receipt={receipt}
        checking={checking}
        onRefresh={refreshReceipt}
        onClose={() => setReceipt(null)}
      />

      {/* Content */}
      {loading ? (
        <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Finding verified vendors...</div>
      ) : vendors.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No verified vendors in {city} yet</div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>Know a vendor? Help build the network.</div>
          <button onClick={() => navigate("/vendor/register")} style={{ background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
            Refer a Vendor →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {vendors.map((vendor, i) => (
            <div key={i} style={{ background: "#141414", border: `1px solid ${selected?._id === vendor._id ? "#E5391F" : "#2A2A2A"}`, borderRadius: 12, padding: "20px", transition: "border-color 0.2s" }}>

              {/* Vendor info */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ fontSize: 16, fontWeight: 700 }}>{vendor.pharmacy_name}</div>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 4, padding: "2px 6px" }}>VERIFIED</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>{vendor.address}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>📞 {vendor.phone}</div>
                </div>
                <div style={{ fontSize: 13, color: "#E5391F", fontWeight: 600, flexShrink: 0, marginLeft: 12 }}>
                  {vendor.distance || `${(i * 0.6 + 0.8).toFixed(1)}km away`}
                </div>
              </div>

              {/* Products */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#555", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  Available Products — tap to select & pay
                </div>
                {(!vendor.products || vendor.products.length === 0) ? (
                  <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>No products listed yet</div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
                    {vendor.products.map((p, j) => {
                      const pName      = typeof p === "string" ? p : (p?.name || "");
                      const pPrice     = typeof p === "string" ? 0 : (p?.price || 0);
                      const pDelivery  = typeof p === "string" ? 0 : (p?.delivery_fee || 0);
                      const pInStock   = typeof p === "string" ? true : (p?.in_stock !== false);
                      const isTarget   = pName.toLowerCase().includes(product.toLowerCase());
                      const isSelected = selected?._id === vendor._id && selProd?.name === pName;

                      return (
                        <div key={j}
                          onClick={() => pInStock ? (setSelected(vendor), setSelProd({ name: pName, price: pPrice, delivery_fee: pDelivery, in_stock: pInStock })) : null}
                          style={{
                            background:  isSelected ? "rgba(229,57,31,0.08)" : "#111",
                            border:     `1px solid ${isSelected ? "#E5391F" : isTarget ? "rgba(229,57,31,0.25)" : "#222"}`,
                            borderRadius: 8, padding: "12px 14px",
                            cursor:      pInStock ? "pointer" : "not-allowed",
                            opacity:     pInStock ? 1 : 0.5,
                            transition:  "all 0.2s",
                          }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                            <div style={{ fontSize: 13, fontWeight: 500, color: isTarget ? "#E5391F" : "#fff" }}>{pName}</div>
                            {isTarget && (
                              <span style={{ fontSize: 9, color: "#E5391F", background: "rgba(229,57,31,0.1)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 3, padding: "1px 5px", flexShrink: 0, marginLeft: 6 }}>Match</span>
                            )}
                          </div>
                          <div style={{ fontSize: 17, fontWeight: 700, color: "#E5391F", marginBottom: 4 }}>
                            {pPrice > 0 ? naira(pPrice) : "Call for price"}
                          </div>
                          <div style={{ fontSize: 10, fontWeight: 600, color: pInStock ? "#43A047" : "#E53935" }}>
                            {pInStock ? "✓ In Stock" : "Out of Stock"}
                          </div>
                          {isSelected && (
                            <div style={{ marginTop: 6, fontSize: 10, color: "#E5391F", fontWeight: 600 }}>✓ Selected</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pay section — only when a product is selected from THIS vendor */}
              {selected?._id === vendor._id && selProd && (
                <div style={{ background: "rgba(229,57,31,0.05)", border: "1px solid rgba(229,57,31,0.2)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Pay for {selProd.name}</div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 14 }}>at {vendor.pharmacy_name} · Secured by Paystack</div>

                  {/* Pickup / Delivery */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                    {[
                      { key: "pickup",   title: "Pickup",   sub: "Collect from vendor", fee: 0 },
                      { key: "delivery", title: "Delivery", sub: "To your address",     fee: selProd.delivery_fee || 0 },
                    ].map(o => {
                      const active = orderForm.mode === o.key;
                      return (
                        <button key={o.key} type="button"
                          onClick={() => setOrderForm(f => ({ ...f, mode: o.key }))}
                          style={{
                            background: active ? "rgba(229,57,31,0.08)" : "#0A0A0A",
                            border: `1px solid ${active ? "rgba(229,57,31,0.4)" : "#2A2A2A"}`,
                            borderRadius: 10, padding: "12px 14px", color: "#fff", cursor: "pointer",
                            textAlign: "left", fontFamily: "inherit",
                          }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{o.title}</div>
                          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{o.sub}</div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: active ? "#E5391F" : "#fff", marginTop: 6 }}>
                            {o.fee > 0 ? `+${naira(o.fee)}` : "Free"}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Customer details */}
                  <div style={{ display: "grid", gap: 8, marginBottom: orderForm.mode === "delivery" ? 12 : 0 }}>
                    {orderForm.mode === "delivery" && (
                      <textarea placeholder="Delivery address" rows={2} value={orderForm.delivery_address}
                        onChange={e => setOrderForm(f => ({ ...f, delivery_address: e.target.value }))}
                        style={{ ...inputStyle, resize: "none" }} />
                    )}
                  </div>

                  {/* Summary */}
                  <div style={{ borderTop: "1px solid #1A1A1A", paddingTop: 10, marginBottom: 12, fontSize: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#999" }}>
                      <span>Product</span><span>{naira(selProd.price)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#999" }}>
                      <span>Delivery fee</span><span>{deliveryFee > 0 ? naira(deliveryFee) : "Free"}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 700 }}>
                      <span>Total</span><span style={{ color: "#E5391F" }}>{naira(totalToPay)}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { setSelected(null); setSelProd(null); }}
                      style={{ background: "transparent", color: "#555", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                      Cancel
                    </button>
                    <button
                      onClick={() => initiatePayment(vendor, selProd)}
                      disabled={paying || selProd.price <= 0}
                      style={{ flex: 1, background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: paying ? 0.7 : 1 }}>
                      {paying ? "Processing..." : selProd.price > 0 ? `Pay ${naira(totalToPay)} via Paystack →` : "Call for price"}
                    </button>
                  </div>
                </div>
              )}

              {/* Call button — when nothing selected */}
              {!(selected?._id === vendor._id && selProd) && (
                <a href={`tel:${vendor.phone}`}
                  style={{ display: "block", background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px", fontSize: 12, textAlign: "center", textDecoration: "none", fontFamily: "inherit" }}>
                  📞 Call Vendor
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      <div style={{ marginTop: 24, background: "#141414", border: "1px solid #2A2A2A", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>Sell genuine products?</div>
          <div style={{ fontSize: 11, color: "#555" }}>Join the Mantios network. Get customers directed to you when fakes are detected nearby.</div>
        </div>
        <button
          onClick={() => navigate("/vendor/register")}
          style={{ background: "transparent", color: "#E5391F", border: "1px solid rgba(229,57,31,0.3)", borderRadius: 8, padding: "10px 18px", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 16 }}>
          Join Network →
        </button>
      </div>
    </div>
  );
}