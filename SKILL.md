---
name: avg-website-check
description: assess a website, web app, or landing page for avg/gdpr risks and turn the findings into a practical compliance-oriented action list. use when a user has a website or product with forms, auth, cookies, analytics, email, databases, hosting, or third-party tools and wants a privacy review, privacy-by-design check, cookie/banner review, privacy policy input, or a controller-processor inventory tailored to modern web stacks such as vercel, supabase, auth providers, analytics tools, and embedded services.
---

# Avg Website Check

Assess the product first, then advise. Do not start from generic legal theory.

This skill is for practical AVG/GDPR reviews of websites and small web apps. Focus on what the product actually collects, where the data goes, why it is needed, who can access it, and which concrete measures or documents are missing.

## Default output

Unless the user asks for something else, return these sections in this order:

1. **Quick verdict**
   - 3 to 6 most important risks or gaps
2. **Data map**
   - what data is collected
   - source of the data
   - purpose
   - likely role: controller / processor / subprocessor
3. **Risk review by component**
   - frontend
   - forms / auth
   - database / storage
   - hosting / deployment
   - analytics / cookies / embeds
   - email / notifications / support tooling
4. **Priority actions**
   - now
   - next
   - later
5. **Missing documents / decisions**
   - privacy statement
   - cookie information / consent setup
   - retention choices
   - processor agreements / transfer checks
   - data subject rights process
6. **Assumptions and unknowns**
   - explicitly flag anything not verified

Keep the tone practical. Do not claim the setup is compliant. Say what appears low, medium, or high risk and why.

## Review workflow

Follow this order.

### 1. Build the product picture

Extract or infer these items from the user's description, code, screenshots, files, or links:

- product type: brochure site, lead gen site, app, portal, marketplace, etc.
- audience: b2b, consumers, employees, candidates, patients, etc.
- personal data categories likely involved
- entry points for data collection:
  - contact forms
  - newsletter signup
  - account creation / login
  - payments
  - uploads
  - support chat
  - analytics / adtech
  - cookies / local storage
  - server logs
- service providers and infrastructure:
  - hosting / CDN
  - database
  - auth
  - email
  - analytics
  - payments
  - file storage
  - monitoring
  - error tracking
  - embedded third-party content

If the user has a modern web stack, assume there may be hidden processing through logs, telemetry, auth, and vendor dashboards even when the visible UI looks simple.

### 2. Make a compact data inventory

For each processing activity, capture:

- data involved
- purpose
- likely lawful basis candidate
- where data is stored or sent
- external party involved
- retention question
- main risk or control gap

Use this compact format when useful:

| activity | data | purpose | vendor/location | likely gap |
|---|---|---|---|---|
| contact form | name, email, message | reply to request | website -> database/email tool | missing retention rule |

Do not invent facts. If the basis or vendor location is unknown, mark it as unknown.

### 3. Check the core AVG themes

Always review these themes.

#### A. Data minimisation and purpose limitation

Check whether the product appears to collect more data than needed.

Examples:
- forms asking for phone number when email is enough
- newsletter signup asking for full profile data
- location, tracking, or profile enrichment without clear need
- long-term retention without an operational reason

#### B. Transparency

Check whether the user likely needs:
- a privacy statement
- clearer just-in-time notices near forms or signup flows
- explanation of purposes, categories, recipients, retention, and rights
- cookie information matching actual use

#### C. Consent and cookies

Separate strictly necessary functions from analytics, marketing, and third-party tracking.

Flag common problems:
- analytics or marketing scripts loading before consent where consent is required
- banner wording that nudges or preselects choices
- hiding reject options
- mixing legitimate interest language with consent flows in a confusing way
- privacy statement not matching cookie/banner behaviour

#### D. Access and security

Check for practical web-app safeguards:
- least-privilege access
- admin separation
- MFA for dashboards/admin access where appropriate
- secrets management
- row-level security or equivalent access controls in the database
- audit logging where sensitive access matters
- backups and restore thinking
- deletion / cleanup paths for unused personal data

#### E. Processor management

List processors/subprocessors the user likely needs to review.

For each vendor, check whether the user likely needs:
- a processor agreement / DPA
- transfer assessment awareness if data may leave the EEA
- internal record of why the vendor is used

#### F. Rights handling

Check whether the setup can support:
- access request
- correction
- deletion
- withdrawal of consent
- objection to direct marketing
- export/portability where relevant

If deletion is requested, flag linked systems that may also need action, such as auth, backups, email tooling, analytics audiences, support tools, and file storage.

### 4. Tailor the review to common modern stack components

#### For Supabase

Pay special attention to:
- which tables contain personal data
- whether row-level security is enabled where needed
- service-role key exposure risk
- auth user data and profile tables
- storage buckets with public access
- logs, edge functions, and webhook payloads
- retention / deletion path for users and related records

#### For Vercel

Pay special attention to:
- environment variables and secret handling
- serverless logs and observability data
- preview deployments exposing real data
- form submissions, server actions, and API routes
- third-party integrations injected via the frontend or build pipeline

#### For web forms and lead generation

Check:
- required fields vs optional fields
- anti-spam tools and what they collect
- confirmation emails
- CRM routing
- retention after the lead is handled

#### For auth and user accounts

Check:
- what profile data is mandatory
- social login providers
- password reset flows and email leakage
- user deletion and account closure flow
- role and permission design

#### For analytics / product tools

Check:
- whether the tool is necessary
- whether privacy-friendly configuration exists
- whether identifiers, IP handling, session replay, or ad features are enabled
- whether consent gating is implemented correctly

### 5. Produce actions, not just observations

Translate findings into concrete next steps.

Use this priority model:

- **now**: high-impact gaps or clear legal/operational exposure
- **next**: should be fixed soon, but not blocking
- **later**: governance, polish, or nice-to-have improvements

Action items should be implementation-ready.

Good examples:
- "Add a retention rule for contact form submissions and implement automatic deletion after X months if no customer relationship follows."
- "Review Supabase storage buckets and remove public access for any bucket containing user uploads or personal documents."
- "Block non-essential analytics until consent is given, and align the cookie banner categories with the scripts actually loaded."

Avoid vague advice like "be more compliant" or "improve privacy".

## Output patterns

### Pattern 1: quick website review

Use for short user prompts.

- quick verdict
- top risks
- likely missing items
- priority actions
- assumptions

### Pattern 2: stack-based review

Use when the user shares a stack such as Vercel + Supabase + auth + analytics.

- component-by-component findings
- processor inventory
- practical remediation steps
- short document checklist

### Pattern 3: privacy-policy input pack

Use when the user mainly wants drafting support.

Return:
- processing activities to disclose
- missing choices the user must make before drafting
- draft structure headings
- gaps that would make the policy inaccurate

## Risk heuristics

Treat these as higher-risk signals:

- special category data or children
- public uploads or document sharing
- account areas with broad internal access
- analytics/marketing stack with multiple vendors
- hidden third-party embeds
- no deletion path
- no clear processor inventory
- mismatch between actual behaviour and policy/banner text
- production data used in previews, testing, or demos

Treat these as lower-risk but still relevant:

- simple one-off contact form with minimal fields
- no accounts
- no analytics beyond limited necessary measurement
- no sharing with many vendors

Low risk is not the same as compliant.

## Guardrails

- Do not present the review as formal legal advice.
- Do not claim a lawful basis with certainty unless the user has provided enough detail.
- Do not assume a vendor stores data only in the EU.
- Do not assume a privacy statement, cookie setup, or DPA exists just because a vendor offers it.
- Always distinguish verified facts from inferences.
- Prefer concrete implementation advice over abstract legal explanation.

## Reusable checklist

Use this compact checklist when helpful:

- what personal data enters the system?
- through which UI, API, import, cookie, or log?
- why is each item needed?
- which vendors receive it?
- where could it be stored, cached, logged, or exported?
- who can access it internally?
- how long is it kept?
- how is consent handled where needed?
- how can a person inspect, correct, or delete it?
- which documents and agreements must match this reality?
