export const defaults = {
  KEY: "input",
};
/** @type{(key: string) => boolean}*/
export const isOptional = (key) => key.endsWith("?");
/** @type{(key: string) => string}*/
export const removeOptionalMark = (key) => key.slice(0, -1);
