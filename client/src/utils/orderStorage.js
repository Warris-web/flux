// Keeps the same exports as before + adds order history helpers.
// History is stored per-device as a list of receipt codes; the server is the source of truth for status.

export const saveRecentOrder = (order) => {
  localStorage.setItem("mantios_recent_order", JSON.stringify(order));
};

export const getRecentOrder = () => {
  try {
    return JSON.parse(localStorage.getItem("mantios_recent_order"));
  } catch {
    return null;
  }
};

const CODES_KEY = "mantios_order_codes";
const CUSTOMER_KEY = "mantios_customer";

export const getOrderCodes = () => {
  try {
    return JSON.parse(localStorage.getItem(CODES_KEY)) || [];
  } catch {
    return [];
  }
};

export const addOrderCode = (code) => {
  try {
    const list = [code, ...getOrderCodes().filter((c) => c !== code)].slice(0, 50);
    localStorage.setItem(CODES_KEY, JSON.stringify(list));
  } catch {}
};

// remembers name/phone/address so the form is pre-filled next time
export const saveCustomer = (c) => {
  try {
    localStorage.setItem(
      CUSTOMER_KEY,
      JSON.stringify({
        customer_name: c.customer_name || "",
        customer_phone: c.customer_phone || "",
        delivery_address: c.delivery_address || "",
      })
    );
  } catch {}
};

export const getCustomer = () => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOMER_KEY)) || {};
  } catch {
    return {};
  }
};