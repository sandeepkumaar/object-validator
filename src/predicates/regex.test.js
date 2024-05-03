import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { regex } from "./regex.js";

test("regex", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(regex("hi"), 0);
    let [error2] = tryCatch(regex(/[1-9]/), false);
    let [error3] = tryCatch(regex(/[1-5]/), "89", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected regex instance or literal. Given {hi}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to follow the pattern /[1-9]/. Given {input: false}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {custom} to follow the pattern /[1-5]/. Given {custom: 89}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(regex(/[1-9]/)(123), 123);
  });
});
