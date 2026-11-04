import assert from "node:assert/strict";
import { test } from "node:test";

import {
  API_ROUTES,
  ADMISSION_STATUSES,
  EMAIL_VERIFICATION_STATUSES,
  RSVP_STATUSES,
  isTicketEligible,
} from "../src/lib/contracts/index.ts";

test("verification and RSVP remain independent states", () => {
  assert.deepEqual(EMAIL_VERIFICATION_STATUSES, ["unverified", "verified"]);
  assert.deepEqual(RSVP_STATUSES, ["unanswered", "yes", "no"]);
  assert.ok(ADMISSION_STATUSES.includes("waitlisted"));
});

test("only verified, YES, admitted registrations are ticket eligible", () => {
  const eligible = { emailVerification: "verified", rsvp: "yes", admission: "admitted" };
  assert.equal(isTicketEligible(eligible), true);
  for (const incomplete of [
    { ...eligible, emailVerification: "unverified" },
    { ...eligible, rsvp: "unanswered" },
    { ...eligible, rsvp: "no" },
    { ...eligible, admission: "waitlisted" },
    { ...eligible, admission: "cancelled" },
    { ...eligible, admission: "rejected" },
    { ...eligible, admission: "pending" },
  ]) {
    assert.equal(isTicketEligible(incomplete), false);
  }
});

test("shared paths are stable and encode dynamic identifiers", () => {
  assert.equal(API_ROUTES.public.confirmVerification, "/api/public/verification/confirm");
  assert.equal(API_ROUTES.public.rsvp, "/api/public/rsvp");
  assert.equal(API_ROUTES.staff.checkin, "/api/staff/checkin");
  assert.equal(API_ROUTES.admin.eventGuests("event/1"), "/api/admin/events/event%2F1/guests");
});
