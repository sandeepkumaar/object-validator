export const defaults = {
  KEY: "input",
  schemaOpts: {
    aggregateError: false,
  },
  composeOpts: {
    aggregateError: false,
  },
};

export const isOptional = (key) => key.endsWith("?");
export const removeOptionalMark = (key) => key.slice(0, -1);
