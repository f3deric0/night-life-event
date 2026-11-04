# 17 — Official references and verification log

Checked at planning date **2026-11-04**. Links below are for implementation verification. They may change; agent must consult current docs before choosing package versions, auth SDKs, quotas and feature availability. This is not a claim that an integration has been implemented or tested.

## OpenAI / Codex
- Codex overview and coding agent: https://developers.openai.com/api/docs/guides/code-generation
- Model selection/effort/cost performance guidance: https://developers.openai.com/api/docs/guides/model-selection
- Using Codex with ChatGPT plan (availability/limits): https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan
- Codex Cloud setup, repository, environment and continuity: https://help.openai.com/en/articles/20001545-using-codex-cloud
- ChatGPT and Codex usage limits: https://help.openai.com/en/articles/20001625-understanding-chatgpt-and-codex-usage-limits
- Iterative Codex workflow and `AGENTS.md`: https://developers.openai.com/cookbook/examples/codex/iterating-development-workflows-with-codex
- Model family and `gpt-6.1-sol`: https://developers.openai.com/api/docs/models/gpt-6.1-sol

## Supabase
- Auth overview (Auth vs RLS): https://supabase.com/docs/guides/auth
- Password authentication (email/phone + password): https://supabase.com/docs/guides/auth/passwords
- Next.js quickstart: https://supabase.com/docs/guides/auth/quickstarts/nextjs
- Next.js project setup: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- Supabase-way authorization/security: https://supabase.com/docs/guides/getting-started/the-supabase-way-to-build

## Other technical references for implementation check
- Next.js: https://nextjs.org/docs
- Resend docs: https://resend.com/docs
- Vercel deployment: https://vercel.com/docs
- GitHub repository basics: https://docs.github.com/en/repositories
- Browser camera secure contexts / `getUserMedia`: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- Web QR scanning library example (validate maintenance): https://github.com/mebjas/html5-qrcode
- European GDPR primary legal text: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- EDPB: https://www.edpb.europa.eu/
- Belgian DPA: https://www.dataprotectionauthority.be/

## Freshness notes
- No assurance on per-account Codex exact credits/model availability; check live model picker and account Usage.
- API token prices found on model websites do not directly quantify Codex subscription charges.
- Provider free tiers, daily email limits, SMS/mail quotas and hosting fees are time-variable; validate at purchase/launch.
- This file gives references, not screenshots or verified live code execution.
