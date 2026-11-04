import assert from "node:assert/strict";
import { test } from "node:test";
import { isDemoCodeValid, validateGuest } from "../src/lib/guest-demo/invite.ts";

const valid = {
  firstName: "Ada", lastName: "Lovelace", birthDate: "1997-04-04",
  email: "ada@example.org", prefix: "+32", phone: "470 12 34 56", demoAck: true,
};

test("guest-demo: only the documented fictional gift code is accepted", () => {
  assert.equal(isDemoCodeValid(" notte-demo-26 "), true);
  for (const value of ["", "UNKNOWN", "NOTTE-DEMO-25", "nottedemo26"])
    assert.equal(isDemoCodeValid(value), false);
});
test("guest-demo: valid synthetically generated guest data is accepted", () => {
  assert.deepEqual(validateGuest(valid, new Date("2026-11-04")), {});
});
test("guest-demo: invalid and future birth date are denied", () => {
  assert.ok(validateGuest({ ...valid, birthDate: "2030-01-01" }, new Date("2026-11-04")).birthDate);
  assert.ok(validateGuest({ ...valid, birthDate: "" }, new Date("2026-11-04")).birthDate);
});
test("guest-demo: email/phone required and demo acknowledgement explicit", () => {
  const errors = validateGuest({ ...valid, email:"invalid", phone:"a", demoAck:false },new Date("2026-11-04"));
  assert.ok(errors.email);
  assert.ok(errors.phone);
  assert.ok(errors.demoAck);
});
