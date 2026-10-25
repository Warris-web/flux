export const naira = (n) => `₦${Number(n || 0).toLocaleString()}`;

export const STATUS = {
  pending:          { label: "Awaiting payment", color: "#F59E0B" },
  paid:             { label: "Paid",             color: "#43A047" },
  confirmed:        { label: "Confirmed",        color: "#43A047" },
  ready_for_pickup: { label: "Ready for pickup", color: "#42A5F5" },
  delivered:        { label: "Delivered",        color: "#43A047" },
  cancelled:        { label: "Cancelled",        color: "#E53935" },
};

export const isPaid = (status) => status && status !== "pending" && status !== "cancelled";

// API order (from /api/orders/*)  ->  receipt shape used by the UI
export const fromApi = (o) => ({
  code:            o.code,
  status:          o.status,
  mode:            o.mode,
  product:         o.product,
  productAmount:   o.productAmount,
  deliveryFee:     o.deliveryFee,
  total:           o.total,
  vendor:          o.vendor,
  address:         o.vendorAddress,
  phone:           o.vendorPhone,
  customerName:    o.customer_name,
  deliveryAddress: o.delivery_address,
  date:            o.created_at,
  paymentUrl:      o.payment_url || null,
});

export const receiptRows = (r) => [
  ["Vendor",  r.vendor],
  ["Vendor address", r.address],
  ["Vendor phone",   r.phone],
  ["Product", r.product],
  ["Method",  r.mode === "delivery" ? "Home delivery" : "Pickup"],
  ...(r.mode === "delivery" && r.deliveryAddress ? [["Deliver to", r.deliveryAddress]] : []),
  ["Product amount", naira(r.productAmount)],
  ["Delivery fee", r.mode === "delivery" && r.deliveryFee > 0 ? naira(r.deliveryFee) : "Free"],
  ["Total", naira(r.total)],
  ["Status", STATUS[r.status]?.label || r.status],
  ["Date",   r.date ? new Date(r.date).toLocaleString("en-NG") : "—"],
].filter(([, v]) => v !== undefined && v !== null && v !== "");

export const receiptText = (r) =>
  `Mantios Receipt\nCode: ${r.code}\n` +
  receiptRows(r).map(([k, v]) => `${k}: ${v}`).join("\n");

// Draws the receipt on a canvas and downloads it as a PNG (no extra libraries needed)
export function downloadReceiptPng(r) {
  const rows = receiptRows(r);
  const W = 720, pad = 44, valueX = 250, valueW = W - pad - valueX, lineH = 24;
  const font = "Inter, Arial, sans-serif";

  const measure = document.createElement("canvas").getContext("2d");
  measure.font = `15px ${font}`;
  const wrap = (text) => {
    const words = String(text).split(" ");
    const lines = [];
    let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (measure.measureText(test).width > valueW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    lines.push(cur);
    return lines;
  };

  const laid = rows.map(([k, v]) => ({ k, lines: wrap(v) }));
  const rowsH = laid.reduce((s, r2) => s + r2.lines.length * lineH + 14, 0);
  const H = 250 + rowsH + 80;
  const dpr = 2;

  const c = document.createElement("canvas");
  c.width = W * dpr;
  c.height = H * dpr;
  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#E5391F";
  ctx.fillRect(0, 0, W, 8);

  ctx.fillStyle = "#111111";
  ctx.font = `700 26px ${font}`;
  ctx.fillText("Mantios", pad, 64);
  ctx.fillStyle = "#777777";
  ctx.font = `14px ${font}`;
  ctx.fillText("Payment receipt", pad, 88);

  ctx.fillStyle = isPaid(r.status) ? "#43A047" : "#F59E0B";
  ctx.font = `700 13px ${font}`;
  ctx.textAlign = "right";
  ctx.fillText((isPaid(r.status) ? "PAID" : "PENDING"), W - pad, 64);
  ctx.textAlign = "left";

  // code box
  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = "#E5391F";
  ctx.lineWidth = 2;
  ctx.strokeRect(pad, 115, W - pad * 2, 88);
  ctx.setLineDash([]);
  ctx.fillStyle = "#777777";
  ctx.font = `12px ${font}`;
  ctx.textAlign = "center";
  ctx.fillText("RECEIPT CODE", W / 2, 140);
  ctx.fillStyle = "#E5391F";
  ctx.font = `700 34px monospace`;
  ctx.fillText(r.code, W / 2, 182);
  ctx.textAlign = "left";

  // rows
  let y = 245;
  laid.forEach(({ k, lines }) => {
    const strong = k === "Total";
    ctx.fillStyle = "#777777";
    ctx.font = `14px ${font}`;
    ctx.fillText(k, pad, y);
    ctx.fillStyle = strong ? "#E5391F" : "#111111";
    ctx.font = `${strong ? "700" : "400"} 15px ${font}`;
    lines.forEach((ln, i) => ctx.fillText(ln, valueX, y + i * lineH));
    y += lines.length * lineH + 14;
    ctx.strokeStyle = "#EEEEEE";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, y - 18);
    ctx.lineTo(W - pad, y - 18);
    ctx.stroke();
  });

  ctx.fillStyle = "#999999";
  ctx.font = `12px ${font}`;
  ctx.fillText("Show this code to the vendor to collect your order. Verified by Mantios.", pad, H - 34);

  c.toBlob((blob) => {
    if (!blob) return alert("Could not create the receipt image");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mantios-receipt-${r.code}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, "image/png");
}