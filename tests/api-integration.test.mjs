import assert from "node:assert/strict";
import {test} from "node:test";
import {ApiPortError,readJson} from "../src/lib/api-integration/http.ts";
import {confirmVerification,events,register,staffLogin,validateInvite} from "../src/lib/api-integration/handlers.ts";

const url="https://night.example";
const req=(path,body,headers={},method="POST")=>new Request(url+path,{method,headers:{"content-type":"application/json",...headers},...(body===undefined?{}:{body:JSON.stringify(body)})});
const backend=(overrides={})=>new Proxy({...overrides},{get(target,key){if(key in target)return target[key];return async()=>{throw new Error(`unexpected backend call ${String(key)}`);};}});

test("valid invite delegates but missing backend fails closed",async()=>{
  const input={eventSlug:"after-dark",code:"SYNTHETIC-CODE"};
  assert.equal((await validateInvite(req("/api/public/invite/validate",input),null)).status,503);
  let called=false;const response=await validateInvite(req("/api/public/invite/validate",input),backend({validateInvite:async(value)=>{called=true;assert.deepEqual(value,input);return{valid:true,available:true};}}));
  assert.equal(response.status,200);assert.equal(called,true);assert.deepEqual((await response.json()).data,{valid:true,available:true});
});
test("unknown fields, malformed JSON and oversized streams are rejected before adapter",async()=>{
  assert.equal((await validateInvite(req("/api/public/invite/validate",{eventSlug:"after-dark",code:"x",role:"admin"}),backend())).status,400);
  const malformed=new Request(url,{method:"POST",headers:{"content-type":"application/json"},body:"{"});assert.equal((await validateInvite(malformed,backend())).status,400);
  const stream=new ReadableStream({start(c){c.enqueue(new Uint8Array(9000));c.close();}});await assert.rejects(()=>readJson(new Request(url,{method:"POST",headers:{"content-type":"application/json"},body:stream,duplex:"half"})),ApiPortError);
});
test("registration validates privacy fields and requires idempotency",async()=>{
  const input={eventSlug:"after-dark",code:"SYNTHETIC",firstName:"Ada",lastName:"Example",dateOfBirth:"1998-06-01",email:"ada@example.test",phone:"+32470123456",locale:"fr",privacyNoticeVersion:"2026-11-04"};
  assert.equal((await register(req("/api/public/register",input),backend())).status,400);
  let accepted;const response=await register(req("/api/public/register",input,{"idempotency-key":"registration_0001"}),backend({registerAndEnqueueVerification:async(value)=>{accepted=value;}}));
  assert.equal(response.status,202);assert.deepEqual(accepted,input);assert.equal((await response.json()).data.next,"verify_email");
  assert.equal((await register(req("/api/public/register",{...input,dateOfBirth:"2099-01-01"},{"idempotency-key":"registration_0002"}),backend())).status,400);
});
test("verification sets only scoped guest cookie and keeps RSVP separate",async()=>{
  const token="t".repeat(48);const response=await confirmVerification(req("/api/public/verification/confirm",{token}),backend({confirmVerification:async()=>({continuationToken:"guest-secret",maxAgeSeconds:600})}));
  const data=await response.json();assert.equal(data.data.next,"rsvp");assert.equal("rsvp" in data.data,false);const setCookie=response.headers.get("set-cookie");for(const part of ["HttpOnly","Secure","SameSite=Lax"])assert.ok(setCookie.includes(part));assert.equal(JSON.stringify(data).includes("guest-secret"),false);
});
test("staff login requires same-origin and emits protected cookie",async()=>{
  const body={username:"door-one",password:"synthetic-password"};assert.equal((await staffLogin(req("/api/staff/session",body),backend())).status,403);
  const session={staffUserId:"s1",role:"staff",organizationId:"o1",assignedEventIds:["e1"],expiresAt:"2026-11-05T00:00:00Z"};
  const response=await staffLogin(req("/api/staff/session",body,{origin:url}),backend({login:async()=>({session,sessionToken:"staff-secret",maxAgeSeconds:900})}));assert.equal(response.status,200);assert.equal(JSON.stringify(await response.json()).includes("staff-secret"),false);assert.ok(response.headers.get("set-cookie").includes("HttpOnly"));
});
test("adapter authorization errors remain generic and preserve status",async()=>{
  const response=await events(new Request(url+"/api/admin/events",{headers:{cookie:"nle_staff=synthetic"}}),backend({listEvents:async()=>{throw new ApiPortError("forbidden",403);}}));
  assert.equal(response.status,403);const data=await response.json();assert.equal(data.error.code,"forbidden");assert.equal(JSON.stringify(data).includes("synthetic"),false);
});
