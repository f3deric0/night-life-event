import type { CheckinResult, DashboardMetrics, Event, PageResult, RsvpResponse, StaffSession, Ticket } from "../contracts";
export type Locale="it"|"en"|"fr"|"nl";
export interface GuestRegistrationInput{eventSlug:string;code:string;firstName:string;lastName:string;dateOfBirth:string;email:string;phone:string;locale:Locale;privacyNoticeVersion:string;}
export interface EventInput{slug:string;title:string;venue:string;startsAt:string;endsAt:string|null;timezone:string;capacity:number|null;}
export interface CodeBatchInput{kind:"personal"|"shared";maxRedemptions:number;quantity:number;expiresAt:string|null;}
export interface ApiBackend{
 validateInvite(input:{eventSlug:string;code:string},request:Request):Promise<{valid:boolean;available:boolean}>;
 registerAndEnqueueVerification(input:GuestRegistrationInput,idempotencyKey:string,request:Request):Promise<void>;
 resendVerification(challenge:string,idempotencyKey:string,request:Request):Promise<void>;
 confirmVerification(token:string,request:Request):Promise<{continuationToken:string;maxAgeSeconds:number}>;
 setRsvp(sessionToken:string,response:"yes"|"no",idempotencyKey:string,request:Request):Promise<RsvpResponse>; getOwnTicket(sessionToken:string,request:Request):Promise<Ticket>;
 login(username:string,password:string,request:Request):Promise<{session:StaffSession;sessionToken:string;maxAgeSeconds:number}>;getStaffSession(sessionToken:string,request:Request):Promise<StaffSession>;logout(sessionToken:string,request:Request):Promise<void>;
 listEvents(sessionToken:string,cursor:string|null,request:Request):Promise<PageResult<Event>>;createEvent(sessionToken:string,input:EventInput,idempotencyKey:string,request:Request):Promise<Event>;updateEvent(sessionToken:string,eventId:string,input:Partial<EventInput>,idempotencyKey:string,request:Request):Promise<Event>;
 listCodes(sessionToken:string,eventId:string,cursor:string|null,request:Request):Promise<PageResult<Record<string,unknown>>>;createCodes(sessionToken:string,eventId:string,input:CodeBatchInput,idempotencyKey:string,request:Request):Promise<{codes:string[]}>;revokeCode(sessionToken:string,eventId:string,codeId:string,idempotencyKey:string,request:Request):Promise<void>;
 listGuests(sessionToken:string,eventId:string,query:URLSearchParams,request:Request):Promise<PageResult<Record<string,unknown>>>;metrics(sessionToken:string,eventId:string,request:Request):Promise<DashboardMetrics>;exportReport(sessionToken:string,query:URLSearchParams,request:Request):Promise<{filename:string;csv:string}>;
 checkin(sessionToken:string,input:{eventId:string;qrToken:string},request:Request):Promise<CheckinResult>;manualCheckin(sessionToken:string,input:{eventId:string;registrationId:string;reason:string},idempotencyKey:string,request:Request):Promise<CheckinResult>;dispatchTickets(request:Request):Promise<{processed:number}>;acceptEmailWebhook(request:Request):Promise<void>;
}
/* Production stays disabled until approved DB/auth/mail adapters are composed. */
export function getApiBackend():ApiBackend|null{return null;}
