import test from "node:test";
import assert from "node:assert";
import tryCatch from "try-catch";
import { date, toDate, minDate, maxDate, dateEquals } from "./date.js";

test("date", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(date, "asdf");
    let [error2] = tryCatch(date, "asdf", "custom");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be of type Date. Given {input: asdf}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {custom} to be of type Date. Given {custom: asdf}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(date("04/01/2024"), "04/01/2024");
  });
});

test("todate", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(toDate, "asdf");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {input} to be of type Date. Given {input: asdf}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(toDate("04/01/2024"), new Date("04/01/2024"));
  });
});

test("minDate", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(minDate("asdf"), "xxx");
    let [error2] = tryCatch(minDate("04/01/2024"), "yyy");
    let [error3] = tryCatch(minDate("04/02/2024"), "04/01/2024");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {minDate} to be of type Date. Given {minDate: asdf}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to be of type Date. Given {input: yyy}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {input} to be after 04/02/2024. Given {input: 04/01/2024}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(minDate("04/01/2024")("04/02/2024"), "04/02/2024");
  });
});

test("maxDate", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(maxDate("asdf"), "xxx");
    let [error2] = tryCatch(maxDate("04/01/2024"), "yyy");
    let [error3] = tryCatch(maxDate("04/02/2024"), "04/03/2024");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {maxDate} to be of type Date. Given {maxDate: asdf}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to be of type Date. Given {input: yyy}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {input} to be before 04/02/2024. Given {input: 04/03/2024}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(maxDate("04/02/2024")("04/01/2024"), "04/01/2024");
  });
});

test("dateEquals", async (t) => {
  await t.test("failure", () => {
    let [error1] = tryCatch(dateEquals("asdf"), "xxx");
    let [error2] = tryCatch(dateEquals("04/01/2024"), "yyy");
    let [error3] = tryCatch(dateEquals("04/02/2024"), "04/03/2024");
    assert.deepStrictEqual(
      error1?.toString(),
      "TypeError: Expected {dateEquals} to be of type Date. Given {dateEquals: asdf}",
    );
    assert.deepStrictEqual(
      error2?.toString(),
      "TypeError: Expected {input} to be of type Date. Given {input: yyy}",
    );
    assert.deepStrictEqual(
      error3?.toString(),
      "TypeError: Expected {input} to be equal 04/02/2024. Given {input: 04/03/2024}",
    );
  });
  await t.test("pass", () => {
    assert.deepStrictEqual(
      dateEquals("04/02/2024")("04/01/2024"),
      "04/01/2024",
    );
  });
});
