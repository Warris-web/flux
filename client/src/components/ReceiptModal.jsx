// import { naira, STATUS, isPaid, receiptRows, receiptText, downloadReceiptPng } from "../utils/receipt";

// // Props: receipt, onClose, onRefresh (optional — re-checks payment status)
// export default function ReceiptModal({ receipt, onClose, onRefresh, checking = false }) {
//   if (!receipt) return null;

//   const paid = isPaid(receipt.status);
//   const st = STATUS[receipt.status] || { label: receipt.status, color: "#999" };

//   const btnBase = { borderRadius: 8, padding: "11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" };

//   return (
//     <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24, overflowY: "auto" }}>
//       <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420, margin: "auto" }}>
//         <div style={{ textAlign: "center", marginBottom: 20 }}>
//           <div style={{ fontSize: 40, marginBottom: 10 }}>🧾</div>
//           <div style={{ fontSize: 17, fontWeight: 700, color: "#E5391F", marginBottom: 6 }}>Your Receipt</div>
//           <span style={{ fontSize: 10, fontWeight: 700, color: st.color, border: `1px solid ${st.color}55`, background: `${st.color}15`, borderRadius: 4, padding: "3px 8px" }}>
//             {st.label}
//           </span>
//         </div>

//         {/* Receipt code */}
//         <div style={{ background: "#0A0A0A", border: "2px dashed #E5391F", borderRadius: 10, padding: "18px", textAlign: "center", marginBottom: 16 }}>
//           <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Receipt Code</div>
//           <div style={{ fontSize: 30, fontWeight: 700, color: "#E5391F", fontFamily: "monospace", letterSpacing: 5 }}>
//             {receipt.code}
//           </div>
//         </div>

//         {/* Details */}
//         <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px", marginBottom: 14 }}>
//           {receiptRows(receipt).filter(([k]) => k !== "Status").map(([k, v]) => (
//             <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
//               <span style={{ color: "#555" }}>{k}</span>
//               <span style={{ color: k === "Total" ? "#E5391F" : "#fff", fontWeight: k === "Total" ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
//             </div>
//           ))}
//         </div>

//         {/* Instructions */}
//         <div style={{ background: "rgba(229,57,31,0.05)", border: "1px solid rgba(229,57,31,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
//           <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, marginBottom: 4 }}>
//             {paid ? "What next" : "How to use"}
//           </div>
//           <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>
//             {!paid && (
//               <>
//                 1. Tap <strong style={{ color: "#fff" }}>Pay via Paystack</strong> below to complete payment<br />
//                 2. Return to this page after payment<br />
//                 3. Download your receipt and {receipt.mode === "delivery" ? "wait for delivery" : "show the code at the vendor"}
//               </>
//             )}
//             {paid && receipt.mode === "pickup" && (
//               <>Show this code at <strong style={{ color: "#fff" }}>{receipt.vendor}</strong>. They verify it and hand you your genuine {receipt.product}.</>
//             )}
//             {paid && receipt.mode === "delivery" && (
//               <>
//                 <strong style={{ color: "#fff" }}>{receipt.vendor}</strong> will deliver {receipt.product} to your address. Keep this code to confirm delivery.
//               </>
//             )}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//           {!paid && receipt.paymentUrl && (
//             <button
//               onClick={() => { window.location.href = receipt.paymentUrl; }}
//               style={{ width: "100%", background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//               Pay {naira(receipt.total)} via Paystack →
//             </button>
//           )}

//           {!paid && onRefresh && (
//             <button onClick={onRefresh} disabled={checking}
//               style={{ ...btnBase, background: "#1A1A1A", color: "#aaa", border: "1px solid #2A2A2A", opacity: checking ? 0.6 : 1 }}>
//               {checking ? "Checking..." : "I've paid — check status"}
//             </button>
//           )}

//           {paid && (
//             <button onClick={() => downloadReceiptPng(receipt)}
//               style={{ width: "100%", background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
//               Download receipt ↓
//             </button>
//           )}

//           <div style={{ display: "flex", gap: 10 }}>
//             <button
//               onClick={() => navigator.clipboard?.writeText(receiptText(receipt)).then(() => alert("Receipt copied!")).catch(() => alert("Copy failed — please screenshot this page"))}
//               style={{ ...btnBase, flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }}>
//               Copy Receipt
//             </button>
//             <button onClick={onClose}
//               style={{ ...btnBase, flex: 1, background: "transparent", color: "#555", border: "1px solid #2A2A2A" }}>
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { naira, STATUS, isPaid, receiptRows, receiptText, downloadReceiptPng } from "../utils/receipt";

// Props: receipt, onClose, onRefresh (optional — re-checks payment status)
// Unpaid  -> "Complete your payment" card (no code, no date, no vendor contact)
// Paid    -> full receipt with code, breakdown and download
export default function ReceiptModal({ receipt, onClose, onRefresh, checking = false }) {
  if (!receipt) return null;

  const paid = isPaid(receipt.status);
  const st = STATUS[receipt.status] || { label: receipt.status, color: "#999" };

  const btnBase = { borderRadius: 8, padding: "11px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" };
  const primaryBtn = { width: "100%", background: "#E5391F", color: "#fff", border: "none", borderRadius: 8, padding: "13px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };

  // what to show in the details box
  const hidden = paid ? ["Status"] : ["Status", "Date", "Vendor address", "Vendor phone"];
  const rows = receiptRows(receipt).filter(([k]) => !hidden.includes(k));

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24, overflowY: "auto" }}>
      <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 14, padding: 28, width: "100%", maxWidth: 420, margin: "auto" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>{paid ? "🧾" : "💳"}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#E5391F", marginBottom: 6 }}>
            {paid ? "Your Receipt" : "Complete your payment"}
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: st.color, border: `1px solid ${st.color}55`, background: `${st.color}15`, borderRadius: 4, padding: "3px 8px" }}>
            {st.label}
          </span>
        </div>

        {/* Receipt code — paid orders only */}
        {paid && (
          <div style={{ background: "#0A0A0A", border: "2px dashed #E5391F", borderRadius: 10, padding: "18px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.07em" }}>Receipt Code</div>
            <div style={{ fontSize: 30, fontWeight: 700, color: "#E5391F", fontFamily: "monospace", letterSpacing: 5 }}>
              {receipt.code}
            </div>
          </div>
        )}

        {/* Details */}
        <div style={{ background: "#111", border: "1px solid #2A2A2A", borderRadius: 8, padding: "14px", marginBottom: 14 }}>
          {rows.map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12 }}>
              <span style={{ color: "#555" }}>{k}</span>
              <span style={{ color: k === "Total" ? "#E5391F" : "#fff", fontWeight: k === "Total" ? 700 : 400, textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Message */}
        <div style={{ background: "rgba(229,57,31,0.05)", border: "1px solid rgba(229,57,31,0.15)", borderRadius: 8, padding: "10px 12px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: "#E5391F", fontWeight: 600, marginBottom: 4 }}>
            {paid ? "What next" : "Payment needed"}
          </div>
          <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>
            {!paid && (
              <>Your order isn't confirmed until payment is complete. Tap <strong style={{ color: "#fff" }}>Pay</strong> to continue securely on Paystack. Your receipt and code appear here once payment goes through.</>
            )}
            {paid && receipt.mode === "pickup" && (
              <>Show this code at <strong style={{ color: "#fff" }}>{receipt.vendor}</strong>. They verify it and hand you your genuine {receipt.product}.</>
            )}
            {paid && receipt.mode === "delivery" && (
              <><strong style={{ color: "#fff" }}>{receipt.vendor}</strong> will deliver {receipt.product} to your address. Keep this code to confirm delivery.</>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {!paid && receipt.paymentUrl && (
            <button onClick={() => { window.location.href = receipt.paymentUrl; }} style={primaryBtn}>
              Pay {naira(receipt.total)} via Paystack →
            </button>
          )}

          {!paid && onRefresh && (
            <button onClick={onRefresh} disabled={checking}
              style={{ ...btnBase, background: "#1A1A1A", color: "#aaa", border: "1px solid #2A2A2A", opacity: checking ? 0.6 : 1 }}>
              {checking ? "Checking..." : "I've paid — check status"}
            </button>
          )}

          {paid && (
            <button onClick={() => downloadReceiptPng(receipt)} style={primaryBtn}>
              Download receipt ↓
            </button>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {paid && (
              <button
                onClick={() => navigator.clipboard?.writeText(receiptText(receipt)).then(() => alert("Receipt copied!")).catch(() => alert("Copy failed — please screenshot this page"))}
                style={{ ...btnBase, flex: 1, background: "#1A1A1A", color: "#666", border: "1px solid #2A2A2A" }}>
                Copy Receipt
              </button>
            )}
            <button onClick={onClose}
              style={{ ...btnBase, flex: 1, background: "transparent", color: "#555", border: "1px solid #2A2A2A" }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}