import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { is } from "./tiny-schema-wrapper.js";

test("schema wrapper", async () => {
  let value = is("string")("hi");
  let [error] = tryCatch(is("string"), 2);
  assert.deepStrictEqual(value, "hi");
  assert.deepStrictEqual(
    error.toString(),
    "TypeError: Expected {input} to satisfy {string} validation. Given {input: 2}",
  );
});
