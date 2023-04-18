// src/conditionals.ts
var isprimitive = (value) => {
  return value !== Object(value);
};
var isobject = (value) => {
  return Object.prototype.toString.call(value) === "[object Object]";
};
var nullish = (value) => {
  return typeof value === "undefined" || value === null;
};
var nullishFalse = (value) => {
  return nullish(value) || value === false;
};

export { isobject, isprimitive, nullish, nullishFalse };
