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