import { useMemo, useState } from "react";

export default function CheckoutPage() {
  const product = {
    name: "Faceless Toner Serum",
    price: 8500,
    delivery_fee: 1500,
  };

  const [method, setMethod] = useState("pickup");

  const summary = useMemo(() => {
    const productAmount = Number(product.price || 0);
    const deliveryAmount = method === "delivery" ? Number(product.delivery_fee || 0) : 0;

    return {
      productAmount,
      deliveryAmount,
      userPays: productAmount + deliveryAmount,
      vendorGets: productAmount,
    };
  }, [method]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        color: "#fff",
        padding: "48px 20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 22,
        }}
      >
        <div
          style={{
            background: "#141414",
            border: "1px solid #2A2A2A",
            borderRadius: 16,
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#E5391F",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            Checkout
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              paddingBottom: 18,
              borderBottom: "1px solid #1A1A1A",
            }}
          >
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{product.name}</div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
                Authentic product verified by Mantios
              </div>
            </div>

            <div style={{ fontSize: 24, fontWeight: 700, color: "#E5391F" }}>
              ₦{product.price.toLocaleString()}
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontSize: 12,
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 16,
              }}
            >
              Choose your delivery method
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <button
                type="button"
                onClick={() => setMethod("pickup")}
                style={{
                  width: "100%",
                  background: method === "pickup" ? "rgba(229,57,31,0.08)" : "#0A0A0A",
                  border: method === "pickup" ? "1px solid rgba(229,57,31,0.4)" : "1px solid #2A2A2A",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Pickup</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Collect from vendor store
                  </div>
                </div>
                <div style={{ fontSize: 14, color: method === "pickup" ? "#E5391F" : "#fff", fontWeight: 600 }}>
                  ₦0
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMethod("delivery")}
                style={{
                  width: "100%",
                  background: method === "delivery" ? "rgba(229,57,31,0.08)" : "#0A0A0A",
                  border: method === "delivery" ? "1px solid rgba(229,57,31,0.4)" : "1px solid #2A2A2A",
                  borderRadius: 12,
                  padding: "16px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  color: "#fff",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>Home Delivery</div>
                  <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                    Delivered to your location
                  </div>
                </div>
                <div style={{ fontSize: 14, color: method === "delivery" ? "#E5391F" : "#fff", fontWeight: 600 }}>
                  ₦{product.delivery_fee.toLocaleString()}
                </div>
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#141414",
            border: "1px solid #2A2A2A",
            borderRadius: 16,
            padding: 24,
            height: "fit-content",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 18,
            }}
          >
            Payment summary
          </div>

          <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
              <span>Product</span>
              <span>₦{summary.productAmount.toLocaleString()}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", color: "#fff" }}>
              <span>Delivery fee</span>
              <span>₦{summary.deliveryAmount.toLocaleString()}</span>
            </div>

            <div
              style={{
                borderTop: "1px solid #1A1A1A",
                paddingTop: 14,
                marginTop: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16 }}>
                <span>Total user pays</span>
                <span style={{ color: "#E5391F" }}>₦{summary.userPays.toLocaleString()}</span>
              </div>
            </div>

            <div
              style={{
                background: "rgba(67,160,71,0.08)",
                border: "1px solid rgba(67,160,71,0.2)",
                borderRadius: 10,
                padding: "12px 14px",
                marginTop: 8,
                color: "#A5D6A7",
                fontSize: 12,
              }}
            >
              Vendor receives: <strong style={{ color: "#43A047" }}>₦{summary.vendorGets.toLocaleString()}</strong>
            </div>
          </div>

          <button
            type="button"
            style={{
              marginTop: 22,
              width: "100%",
              background: "#E5391F",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Pay now
          </button>

          <div
            style={{
              marginTop: 14,
              fontSize: 11,
              color: "#666",
              lineHeight: 1.7,
            }}
          >
            {method === "pickup"
              ? "Pickup is free. The user pays only the product price."
              : "Delivery is added to the customer total. The vendor still receives the product amount only."}
          </div>
        </div>
      </div>
    </div>
  );
}