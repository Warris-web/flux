import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const saveRecentOrder = (order) => {
  try {
    localStorage.setItem("mantios_recent_order", JSON.stringify(order));
  } catch (err) {
    // ignore storage issues
  }
};

const getRecentOrder = () => {
  try {
    const raw = localStorage.getItem("mantios_recent_order");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export default function VendorLocatorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const product = searchParams.get("product") || "Coartem";
  const city = searchParams.get("city") || "Lagos";

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selProd, setSelProd] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [paying, setPaying] = useState(false);
  const [orderForm, setOrderForm] = useState({
    mode: "pickup",
    customer_name: "",
    customer_phone: "",
    delivery_address: "",
    notes: "",
  });

  useEffect(() => {
    axios
      .get(`${API}/api/vendors/nearby`, { params: { city, product } })
      .then((r) => setVendors(r.data.vendors || []))
      .catch(() => setVendors([]))
      .finally(() => setLoading(false));
  }, [city, product]);

  useEffect(() => {
    const payment = searchParams.get("payment");
    const code = searchParams.get("code");
    const pname = searchParams.get("product") || product;
    const mode = searchParams.get("mode") || "pickup";

    if (payment === "success" && code) {
      const savedOrder = getRecentOrder();
      const nextReceipt = savedOrder
        ? { ...savedOrder, code, product: pname, order_mode: mode, status: "confirmed" }
        : {
            code,
            vendor: "Your verified vendor",
            address: "Check your selected vendor above",
            phone: "—",
            product: pname,
            price: 0,
            status: "confirmed",
            order_mode: mode,
            delivery_address: "",
            customer_name: "Customer",
            customer_phone: "—",
            generated_at: new Date().toLocaleString("en-NG"),
            payment_url: null,
          };

      setReceipt(nextReceipt);
      saveRecentOrder(nextReceipt);
    }
  }, [product, searchParams]);

  useEffect(() => {
    const recentOrder = getRecentOrder();
    if (recentOrder && !receipt) {
      setReceipt(recentOrder);
    }
  }, [receipt]);

  const initiatePayment = async (vendor, prod) => {
    setPaying(true);

    try {
      const isDemoVendor = ["demo1", "demo2", "demo3"].includes(vendor._id);

      const payload = {
        vendor_id: isDemoVendor ? null : vendor._id,
        product_name: prod.name,
        amount: prod.price,
        customer_email: "customer@mantios.com",
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        order_mode: orderForm.mode,
        delivery_address: orderForm.mode === "delivery" ? orderForm.delivery_address : "",
        notes: orderForm.notes,
      };

      const { data } = await axios.post(`${API}/api/vendors/pay`, payload);

      const nextReceipt = {
        code: data.receipt_code,
        vendor: vendor.pharmacy_name,
        address: vendor.address,
        phone: vendor.phone,
        product: prod.name,
        price: prod.price,
        status: "paid",
        order_mode: orderForm.mode,
        delivery_address:
          orderForm.mode === "delivery" ? orderForm.delivery_address : vendor.address,
        customer_name: orderForm.customer_name,
        customer_phone: orderForm.customer_phone,
        generated_at: new Date().toLocaleString("en-NG"),
        payment_url: data.payment_url || null,
      };

      setReceipt(nextReceipt);
      saveRecentOrder(nextReceipt);

      setSelected(null);
      setSelProd(null);
      setOrderForm({
        mode: "pickup",
        customer_name: "",
        customer_phone: "",
        delivery_address: "",
        notes: "",
      });
    } catch (err) {
      alert("Payment failed. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 24,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "#141414",
            border: "1px solid #2A2A2A",
            borderRadius: 7,
            padding: "8px 14px",
            fontSize: 12,
            color: "#666",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Back
        </button>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "#E53935",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 2,
            }}
          >
            Counterfeit Detected
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            Buy Genuine {product} Near You
          </div>
          <div style={{ fontSize: 12, color: "#555" }}>
            Mantios-verified vendors in {city}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "rgba(229,57,53,0.05)",
          border: "1px solid rgba(229,57,53,0.2)",
          borderRadius: 10,
          padding: "12px 18px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 20 }}>⚠</div>
        <div style={{ fontSize: 12, color: "#999" }}>
          The <strong style={{ color: "#fff" }}>{product}</strong> you scanned was flagged as{" "}
          <strong style={{ color: "#E53935" }}>COUNTERFEIT</strong>. Purchase from a verified vendor below.
          Pay via Paystack and receive a receipt code to show at the vendor.
        </div>
      </div>

      {receipt && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: 24,
          }}
        >
          <div
            style={{
              background: "#141414",
              border: "1px solid #2A2A2A",
              borderRadius: 14,
              padding: 28,
              width: "100%",
              maxWidth: 440,
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🧾</div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#E5391F",
                  marginBottom: 4,
                }}
              >
                Your Receipt
              </div>
              <div style={{ fontSize: 11, color: "#555" }}>
                {receipt.order_mode === "delivery"
                  ? "Delivery order confirmed"
                  : "Pickup order confirmed"}
              </div>
            </div>

            <div
              style={{
                background: "#0A0A0A",
                border: "2px dashed #E5391F",
                borderRadius: 10,
                padding: "18px",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#555",
                  marginBottom: 6,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Receipt Code
              </div>
              <div
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  color: "#E5391F",
                  fontFamily: "monospace",
                  letterSpacing: 5,
                }}
              >
                {receipt.code}
              </div>
            </div>

            <div
              style={{
                background: "#111",
                border: "1px solid #2A2A2A",
                borderRadius: 8,
                padding: "14px",
                marginBottom: 14,
              }}
            >
              {[
                ["Customer", receipt.customer_name || "Customer"],
                ["Phone", receipt.customer_phone || "—"],
                ["Vendor", receipt.vendor],
                ["Address", receipt.order_mode === "delivery" ? receipt.delivery_address || receipt.address : receipt.address],
                ["Product", receipt.product],
                ["Mode", receipt.order_mode === "delivery" ? "Delivery" : "Pickup"],
                ["Amount", `₦${(receipt.price || 0).toLocaleString()}`],
                ["Date", receipt.generated_at],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "#555" }}>{k}</span>
                  <span
                    style={{
                      color: k === "Amount" ? "#E5391F" : "#fff",
                      fontWeight: k === "Amount" ? 700 : 400,
                      textAlign: "right",
                      maxWidth: "60%",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                background: "rgba(229,57,31,0.05)",
                border: "1px solid rgba(229,57,31,0.15)",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "#E5391F",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Next step
              </div>
              <div style={{ fontSize: 11, color: "#666", lineHeight: 1.7 }}>
                {receipt.order_mode === "delivery"
                  ? "Your order is confirmed. The vendor will prepare and deliver it to your address."
                  : "Show this receipt code at the vendor counter to collect your item."}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {receipt.payment_url && (
                <button
                  onClick={() => {
                    window.location.href = receipt.payment_url;
                  }}
                  style={{
                    width: "100%",
                    background: "#E5391F",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    padding: "13px",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Pay ₦{(receipt.price || 0).toLocaleString()} via Paystack →
                </button>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => {
                    const text = `Mantios Receipt\nCode: ${receipt.code}\nVendor: ${receipt.vendor}\nCustomer: ${receipt.customer_name || "Customer"}\nPhone: ${receipt.customer_phone || "—"}\nProduct: ${receipt.product}\nMode: ${receipt.order_mode === "delivery" ? "Delivery" : "Pickup"}\nAmount: ₦${(receipt.price || 0).toLocaleString()}\nAddress: ${receipt.order_mode === "delivery" ? receipt.delivery_address || receipt.address : receipt.address}`;
                    navigator.clipboard
                      ?.writeText(text)
                      .then(() => alert("Receipt copied!"))
                      .catch(() => alert("Copy failed — please screenshot this page"));
                  }}
                  style={{
                    flex: 1,
                    background: "#1A1A1A",
                    color: "#666",
                    border: "1px solid #2A2A2A",
                    borderRadius: 8,
                    padding: "11px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Copy Receipt
                </button>

                <button
                  onClick={() => {
                    setReceipt(null);
                  }}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: "#555",
                    border: "1px solid #2A2A2A",
                    borderRadius: 8,
                    padding: "11px",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 40, color: "#555", textAlign: "center" }}>
          Finding verified vendors...
        </div>
      ) : vendors.length === 0 ? (
        <div
          style={{
            background: "#141414",
            border: "1px solid #2A2A2A",
            borderRadius: 12,
            padding: 40,
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏥</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
            No verified vendors in {city} yet
          </div>
          <div style={{ fontSize: 12, color: "#555", marginBottom: 16 }}>
            Know a vendor? Help build the network.
          </div>
          <button
            onClick={() => navigate("/vendor/register")}
            style={{
              background: "#E5391F",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 20px",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Refer a Vendor →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {vendors.map((vendor, i) => (
            <div
              key={i}
              style={{
                background: "#141414",
                border: `1px solid ${selected?._id === vendor._id ? "#E5391F" : "#2A2A2A"}`,
                borderRadius: 12,
                padding: "20px",
                transition: "border-color 0.2s ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 4,
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: 700 }}>
                      {vendor.pharmacy_name}
                    </div>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "#E5391F",
                        background: "rgba(229,57,31,0.1)",
                        border: "1px solid rgba(229,57,31,0.2)",
                        borderRadius: 4,
                        padding: "2px 6px",
                      }}
                    >
                      Verified
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>{vendor.address}</div>
                  <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
                    📞 {vendor.phone}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#E5391F",
                    fontWeight: 600,
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  {vendor.distance || `${(i * 0.6 + 0.8).toFixed(1)}km away`}
                </div>
              </div>

              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: 10,
                  }}
                >
                  Available Products — tap to select
                </div>

                {(!vendor.products || vendor.products.length === 0) ? (
                  <div style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>
                    No products listed yet
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: 10,
                    }}
                  >
                    {vendor.products.map((p, j) => {
                      const pName = typeof p === "string" ? p : p?.name || "";
                      const pPrice = typeof p === "string" ? 0 : p?.price || 0;
                      const pInStock = typeof p === "string" ? true : p?.in_stock !== false;
                      const isTarget = pName.toLowerCase().includes(product.toLowerCase());
                      const isSelected =
                        selected?._id === vendor._id && selProd?.name === pName;

                      return (
                        <div
                          key={j}
                          onClick={() =>
                            pInStock
                              ? setSelProd({ name: pName, price: pPrice, in_stock: pInStock }) &&
                                setSelected(vendor)
                              : null
                          }
                          style={{
                            background: isSelected ? "rgba(229,57,31,0.08)" : "#111",
                            border: `1px solid ${isSelected ? "#E5391F" : isTarget ? "rgba(229,57,31,0.25)" : "#222"}`,
                            borderRadius: 8,
                            padding: "12px 14px",
                            cursor: pInStock ? "pointer" : "not-allowed",
                            opacity: pInStock ? 1 : 0.5,
                            transition: "all 0.2s",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: 6,
                            }}
                          >
                            <div
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: isTarget ? "#E5391F" : "#fff",
                              }}
                            >
                              {pName}
                            </div>
                            {isTarget && (
                              <span
                                style={{
                                  fontSize: 9,
                                  color: "#E5391F",
                                  background: "rgba(229,57,31,0.1)",
                                  border: "1px solid rgba(229,57,31,0.2)",
                                  borderRadius: 3,
                                  padding: "1px 5px",
                                }}
                              >
                                Target
                              </span>
                            )}
                          </div>

                          <div
                            style={{
                              fontSize: 17,
                              fontWeight: 700,
                              color: "#E5391F",
                              marginBottom: 4,
                            }}
                          >
                            {pPrice > 0 ? `₦${pPrice.toLocaleString()}` : "Call for price"}
                          </div>

                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 600,
                              color: pInStock ? "#43A047" : "#E53935",
                            }}
                          >
                            {pInStock ? "✓ In Stock" : "Out of Stock"}
                          </div>

                          {isSelected && (
                            <div
                              style={{
                                marginTop: 6,
                                fontSize: 10,
                                color: "#E5391F",
                                fontWeight: 600,
                              }}
                            >
                              ✓ Selected
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {selected?._id === vendor._id && selProd && (
                <div
                  style={{
                    background: "rgba(229,57,31,0.05)",
                    border: "1px solid rgba(229,57,31,0.2)",
                    borderRadius: 10,
                    padding: "14px 16px",
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>
                        Buy {selProd.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#555" }}>
                        at {vendor.pharmacy_name} · Verified vendor
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 700,
                        color: "#E5391F",
                      }}
                    >
                      {selProd.price > 0 ? `₦${selProd.price.toLocaleString()}` : "—"}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                    <button
                      onClick={() => setOrderForm((prev) => ({ ...prev, mode: "pickup" }))}
                      style={{
                        flex: 1,
                        background: orderForm.mode === "pickup" ? "#E5391F" : "transparent",
                        color: orderForm.mode === "pickup" ? "#fff" : "#999",
                        border: "1px solid #2A2A2A",
                        borderRadius: 8,
                        padding: "10px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Pick up
                    </button>

                    <button
                      onClick={() => setOrderForm((prev) => ({ ...prev, mode: "delivery" }))}
                      style={{
                        flex: 1,
                        background: orderForm.mode === "delivery" ? "#E5391F" : "transparent",
                        color: orderForm.mode === "delivery" ? "#fff" : "#999",
                        border: "1px solid #2A2A2A",
                        borderRadius: 8,
                        padding: "10px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Delivery
                    </button>
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>
                        Full name
                      </div>
                      <input
                        value={orderForm.customer_name}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            customer_name: e.target.value,
                          }))
                        }
                        placeholder="Your full name"
                        style={{
                          width: "100%",
                          background: "#0A0A0A",
                          border: "1px solid #2A2A2A",
                          borderRadius: 8,
                          padding: "10px 12px",
                          color: "#fff",
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    <div>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>
                        Phone number
                      </div>
                      <input
                        value={orderForm.customer_phone}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            customer_phone: e.target.value,
                          }))
                        }
                        placeholder="080..."
                        style={{
                          width: "100%",
                          background: "#0A0A0A",
                          border: "1px solid #2A2A2A",
                          borderRadius: 8,
                          padding: "10px 12px",
                          color: "#fff",
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      />
                    </div>

                    {orderForm.mode === "delivery" && (
                      <div>
                        <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>
                          Delivery address
                        </div>
                        <textarea
                          value={orderForm.delivery_address}
                          onChange={(e) =>
                            setOrderForm((prev) => ({
                              ...prev,
                              delivery_address: e.target.value,
                            }))
                          }
                          placeholder="House number / street / area / city"
                          rows={3}
                          style={{
                            width: "100%",
                            background: "#0A0A0A",
                            border: "1px solid #2A2A2A",
                            borderRadius: 8,
                            padding: "10px 12px",
                            color: "#fff",
                            fontSize: 12,
                            resize: "vertical",
                            fontFamily: "inherit",
                          }}
                        />
                      </div>
                    )}

                    <div>
                      <div style={{ fontSize: 11, color: "#666", marginBottom: 5 }}>
                        Order note (optional)
                      </div>
                      <input
                        value={orderForm.notes}
                        onChange={(e) =>
                          setOrderForm((prev) => ({
                            ...prev,
                            notes: e.target.value,
                          }))
                        }
                        placeholder="Any extra instruction"
                        style={{
                          width: "100%",
                          background: "#0A0A0A",
                          border: "1px solid #2A2A2A",
                          borderRadius: 8,
                          padding: "10px 12px",
                          color: "#fff",
                          fontSize: 12,
                          fontFamily: "inherit",
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
                    <button
                      onClick={() => {
                        setSelected(null);
                        setSelProd(null);
                      }}
                      style={{
                        background: "transparent",
                        color: "#555",
                        border: "1px solid #2A2A2A",
                        borderRadius: 8,
                        padding: "10px 16px",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => initiatePayment(vendor, selProd)}
                      disabled={
                        paying ||
                        selProd.price <= 0 ||
                        !orderForm.customer_name ||
                        !orderForm.customer_phone ||
                        (orderForm.mode === "delivery" && !orderForm.delivery_address)
                      }
                      style={{
                        flex: 1,
                        background: "#E5391F",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        padding: "11px",
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        opacity:
                          paying ||
                          selProd.price <= 0 ||
                          !orderForm.customer_name ||
                          !orderForm.customer_phone ||
                          (orderForm.mode === "delivery" && !orderForm.delivery_address)
                            ? 0.7
                            : 1,
                      }}
                    >
                      {paying
                        ? "Processing..."
                        : `Pay ₦${selProd.price.toLocaleString()} via Paystack →`}
                    </button>
                  </div>
                </div>
              )}

              {!(selected?._id === vendor._id && selProd) && (
                <a
                  href={`tel:${vendor.phone}`}
                  style={{
                    display: "block",
                    background: "#1A1A1A",
                    color: "#666",
                    border: "1px solid #2A2A2A",
                    borderRadius: 8,
                    padding: "10px",
                    fontSize: 12,
                    textAlign: "center",
                    textDecoration: "none",
                    marginTop: 12,
                  }}
                >
                  📞 Call Vendor
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          marginTop: 24,
          background: "#141414",
          border: "1px solid #2A2A2A",
          borderRadius: 10,
          padding: "16px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>
            Sell genuine products?
          </div>
          <div style={{ fontSize: 11, color: "#555" }}>
            Join the Mantios network. Get customers directed to you when fakes are detected nearby.
          </div>
        </div>
        <button
          onClick={() => navigate("/vendor/register")}
          style={{
            background: "transparent",
            color: "#E5391F",
            border: "1px solid rgba(229,57,31,0.3)",
            borderRadius: 8,
            padding: "10px 18px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Join Network →
        </button>
      </div>
    </div>
  );
}