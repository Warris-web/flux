import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReceiptModal from "../components/ReceiptModal";
import { fromApi, naira, STATUS } from "../utils/receipt";
import { getOrderCodes, addOrderCode } from "../utils/orderStorage";

const API = import.meta.env.VITE_API_URL;

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [open,     setOpen]     = useState(null);
  const [checking, setChecking] = useState(false);
  const [code,     setCode]     = useState("");
  const [finding,  setFinding]  = useState(false);

  const load = async () => {
    const codes = getOrderCodes();
    if (codes.length === 0) { setOrders([]); setLoading(false); return; }
    try {
      const { data } = await axios.post(`${API}/api/orders/lookup`, { codes });
      setOrders(data.orders.map(fromApi));
    } catch {
      setOrders([]);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  // re-check one order (e.g. user just paid) and update the open modal + list
  const refreshOpen = async () => {
    if (!open) return;
    setChecking(true);
    try {
      const { data } = await axios.get(`${API}/api/orders/receipt/${encodeURIComponent(open.code)}`);
      const fresh = fromApi(data.order);
      setOpen(fresh);
      setOrders(list => list.map(o => (o.code === fresh.code ? fresh : o)));
    } catch { alert("Couldn't check payment status. Try again."); }
    finally { setChecking(false); }
  };

  // add an order made on another device using its receipt code
  const findByCode = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setFinding(true);
    try {
      await axios.get(`${API}/api/orders/receipt/${encodeURIComponent(c)}`);
      addOrderCode(c);
      setCode("");
      await load();
    } catch { alert("No order found with that code"); }
    finally { setFinding(false); }
  };

  return (
    <div style={{ padding: 24, maxWidth: 760, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
        <button onClick={() => navigate(-1)} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#666", cursor: "pointer", fontFamily: "inherit" }}>
          ← Back
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>My Orders</div>
          <div style={{ fontSize: 12, color: "#555" }}>Orders made on this device</div>
        </div>
        <button onClick={() => { setLoading(true); load(); }} style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 7, padding: "8px 14px", fontSize: 12, color: "#E5391F", cursor: "pointer", fontFamily: "inherit" }}>
          Refresh
        </button>
      </div>

      {/* Find by code */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Have a receipt code? e.g. VS-ABC123-XY12"
          value={code}
          onChange={e => setCode(e.target.value)}
          style={{ flex: 1, background: "#0A0A0A", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#fff", outline: "none", fontFamily: "inherit" }}
        />
        <button onClick={findByCode} disabled={finding}
          style={{ background: "#1A1A1A", color: "#aaa", border: "1px solid #2A2A2A", borderRadius: 8, padding: "10px 16px", fontSize: 12, cursor: "pointer", fontFamily: "inherit", opacity: finding ? 0.6 : 1 }}>
          {finding ? "Finding..." : "Add"}
        </button>
      </div>

      <ReceiptModal receipt={open} checking={checking} onRefresh={refreshOpen} onClose={() => setOpen(null)} />

      {loading ? (
        <div style={{ padding: 40, color: "#555", textAlign: "center" }}>Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div style={{ background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🧾</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No orders yet</div>
          <div style={{ fontSize: 12, color: "#555" }}>Orders you pay for through Mantios vendors will show up here.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {orders.map(o => {
            const st = STATUS[o.status] || { label: o.status, color: "#999" };
            return (
              <button key={o.code} onClick={() => setOpen(o)}
                style={{ textAlign: "left", background: "#141414", border: "1px solid #2A2A2A", borderRadius: 12, padding: "16px 18px", color: "#fff", cursor: "pointer", fontFamily: "inherit", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{o.product}</div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    {o.vendor} · {o.mode === "delivery" ? "Delivery" : "Pickup"}
                  </div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 4, fontFamily: "monospace" }}>
                    {o.code} · {o.date ? new Date(o.date).toLocaleDateString("en-NG") : ""}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#E5391F", marginBottom: 6 }}>{naira(o.total)}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, color: st.color, border: `1px solid ${st.color}55`, background: `${st.color}15`, borderRadius: 4, padding: "2px 7px" }}>
                    {st.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}