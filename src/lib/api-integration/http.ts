import type { ApiErrorCode } from "../contracts";

const SAFE_MESSAGES: Record<ApiErrorCode, string> = {
  unauthenticated: "Authentication required.", forbidden: "Operation not permitted.", invalid_input: "Invalid request.",
  not_found: "Resource not found.", quota_exhausted: "Request cannot be completed.", rate_limited: "Too many requests.",
  conflict: "Request conflicts with current state.", temporarily_unavailable: "Service temporarily unavailable.",
};
export class ApiPortError extends Error { readonly code:ApiErrorCode;readonly status:number;constructor(code:ApiErrorCode,status:number){super(code);this.code=code;this.status=status;} }
const secureHeaders = { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
export function apiError(code: ApiErrorCode, status: number): Response { return Response.json({ ok:false, error:{ code, message:SAFE_MESSAGES[code], traceId:crypto.randomUUID() } }, { status, headers:secureHeaders }); }
export function apiOk<T>(data:T,status=200,extraHeaders?:HeadersInit):Response{const responseHeaders=new Headers(secureHeaders);if(extraHeaders)new Headers(extraHeaders).forEach((value,key)=>responseHeaders.set(key,value));return Response.json({ok:true,data},{status,headers:responseHeaders});}
export const unavailable=()=>apiError("temporarily_unavailable",503); export const invalid=()=>apiError("invalid_input",400);
export function mapPortError(error:unknown):Response{return error instanceof ApiPortError?apiError(error.code,error.status):unavailable();}

export async function readJson(request:Request,maximumBytes=8192):Promise<unknown>{
  if(!/^application\/json(?:\s*;|\s*$)/i.test(request.headers.get("content-type")??""))throw new ApiPortError("invalid_input",400);
  const declared=request.headers.get("content-length"); if(declared&&(!/^\d+$/.test(declared)||Number(declared)>maximumBytes))throw new ApiPortError("invalid_input",400);
  if(!request.body)throw new ApiPortError("invalid_input",400); const reader=request.body.getReader(),chunks:Uint8Array[]=[];let size=0;
  try{for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>maximumBytes){void reader.cancel();throw new ApiPortError("invalid_input",400);}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(bytes)) as unknown;}catch(error){if(error instanceof ApiPortError)throw error;throw new ApiPortError("invalid_input",400);}
}
export function exactObject(value:unknown,keys:readonly string[]):value is Record<string,unknown>{return !!value&&typeof value==="object"&&!Array.isArray(value)&&Object.keys(value).every(key=>keys.includes(key));}
export const bounded=(value:unknown,min:number,max:number):value is string=>typeof value==="string"&&value.length>=min&&value.length<=max&&!/[\u0000-\u001f\u007f]/u.test(value);
export const slug=(value:unknown):value is string=>bounded(value,1,100)&&/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
export const identifier=(value:unknown):value is string=>bounded(value,1,128)&&/^[A-Za-z0-9_-]+$/.test(value);
export const email=(value:unknown):value is string=>bounded(value,3,254)&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
export const phone=(value:unknown):value is string=>bounded(value,7,32)&&/^\+[1-9]\d{6,14}$/.test(value);
export const isoDate=(value:unknown):value is string=>typeof value==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(`${value}T00:00:00Z`));
export const isoDateTime=(value:unknown):value is string=>typeof value==="string"&&!Number.isNaN(Date.parse(value));
export function requireIdempotencyKey(request:Request):string{const key=request.headers.get("idempotency-key");if(!key||!/^[A-Za-z0-9_-]{16,128}$/.test(key))throw new ApiPortError("invalid_input",400);return key;}
export function requireSameOrigin(request:Request):void{const origin=request.headers.get("origin");if(!origin||origin!==new URL(request.url).origin)throw new ApiPortError("forbidden",403);}
export function cookie(request:Request,name:string):string|null{const match=request.headers.get("cookie")?.split(";").map(part=>part.trim()).find(part=>part.startsWith(`${name}=`));return match?decodeURIComponent(match.slice(name.length+1)):null;}
export const secureCookie=(name:string,value:string,maxAge:number)=>`${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
export const clearCookie=(name:string)=>`${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
