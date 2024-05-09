import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { defined, setDefault, hasKeys, pick } from "./misc.js";

test("defined", async () => {
  let value = defined("hi", "key");
  assert.deepStrictEqual(value, "hi");
  let [error] = tryCatch(defined, undefined, "key");
  assert.deepStrictEqual(
    error.toString(),
    "TypeError: Expected {key} to be defined. Given {key: undefined}",
  );
});

test("setDefault", async () => {
  let value = setDefault(18)();
  assert.deepStrictEqual(value, 18);
  let [error] = tryCatch(setDefault(), 18);
  assert.deepStrictEqual(
    error.toString(),
    "TypeError: Expected {default} to be defined. Given {default: undefined}",
  );
});

test("hasKeys", async () => {
  let value = hasKeys(["name", "age"])({
    name: "sand",
    age: 18,
  });
  assert.deepStrictEqual(value, {
    name: "sand",
    age: 18,
  });
  let [error] = tryCatch(hasKeys(["name", "age"]), { name: "" });
  assert.deepStrictEqual(
    error.toString(),
    "TypeError: Expected properties age on the input object",
  );
});

test("pick", async () => {
  let value = pick(["name"])({
    name: "sand",
    age: 18,
  });
  assert.deepStrictEqual(value, {
    name: "sand",
  });
});
