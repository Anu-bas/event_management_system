const generateCode = (title) => {
  const prefix = title.replace(/[^a-zA-Z]/g, "").slice(0, 3).toUpperCase() || "EVT";
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${num}`;
};

module.exports = generateCode;
