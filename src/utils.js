export const isObject = (val) => {
  return typeof val === 'object' && val !== null;
};

export const isString = (val) => {
  return typeof val === 'string' || val instanceof String;
};

export const isNumber = (val) => {
  return typeof val === 'number' && isFinite(val);
};

export const getCurrentDateTimeString = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
