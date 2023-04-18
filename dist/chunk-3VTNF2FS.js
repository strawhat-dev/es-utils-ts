// src/promises.ts
var sleep = async (ms) => {
  return new Promise((res) => setTimeout(res, +ms));
};
var cdn = async (name) => {
  const mod = await import(`https://esm.run/${name}`);
  return mod?.default || mod;
};

export { cdn, sleep };
