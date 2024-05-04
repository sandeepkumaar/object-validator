export const defaults = {
  KEY: "input",
  /** @type {{aggregateError?: boolean, strict?: boolean}} */
  schemaOpts: {
    aggregateError: false,
    strict: true,
  },
  /** @type {{aggregateError?: boolean, onError?: function}} */
  composeOpts: {
    aggregateError: false,
  },
};
/** @type{(key: string) => boolean}*/
export const isOptional = (key) => key.endsWith("?");
/** @type{(key: string) => string}*/
export const removeOptionalMark = (key) => key.slice(0, -1);
