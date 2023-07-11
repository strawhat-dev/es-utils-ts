import deepEqual from 'deep-equal';

// src/lib/deep-equal.ts
var equal = (...args) => (args[2] ? args[2]["strict"] ??= true : args[2] = { strict: true }, deepEqual(...args));

export { equal };
