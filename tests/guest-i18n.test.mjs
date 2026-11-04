import assert from "node:assert/strict";
import { test } from "node:test";
import { DICTIONARY, LOCALES, detectLocale } from "../src/lib/i18n/dictionary.ts";
import { isSampleCode, validateGuest } from "../src/lib/guest-flow/invite.ts";

const sample = {
  firstName: "Guest", lastName: "Example", birthDate: "1998-06-01",
  email: "guest@example.test", prefix: "+32", phone: "470123456", demoAck: true,
};
test("Four locales have the public and staff copy", () => {
  assert.deepEqual([...LOCALES], ["it", "en", "fr", "nl"]);
  for (const lang of LOCALES) {
    const t = DICTIONARY[lang];
    for (const val of [t.hero.cta,t.hero.question,t.code.label,t.form.firstName,t.form.phone,t.staff.signIn,t.staff.generator])
      assert.ok(typeof val === "string" && val.length > 0);
  }
});
test("Browser languages resolve correctly", () => {
  assert.equal(detectLocale(["nl-BE", "fr-BE"]), "nl");
  assert.equal(detectLocale(["fr-BE"]), "fr");
  assert.equal(detectLocale(["en-US"]), "en");
  assert.equal(detectLocale(["es-ES"]), "it");
});
test("Demo code strictly isolated to design review helper", () => {
  assert.equal(isSampleCode(" sample-0000 "), true);
  for (const c of ["", "other-code", "notte-demo-26"]) assert.equal(isSampleCode(c), false);
});
test("Synthetic guest form validates required fields and dates", () => {
  assert.deepEqual(validateGuest(sample, new Date("2026-11-04")), {});
  const wrong = validateGuest({...sample, birthDate:"2030-05-01", email:"no@", phone:"abc", demoAck:false},new Date("2026-11-04"));
  for (const key of ["birthDate", "email", "phone", "demoAck"]) assert.ok(wrong[key]);
});
