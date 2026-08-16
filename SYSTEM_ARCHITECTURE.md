# OGroup CAE (Customer Acquisition Ecosystem)
## Enterprise System Architecture & PRD

**Version:** 1.0
**Stack:** Laravel 12, PHP 8.4, MySQL 9, Redis, React/Flutter

This document outlines the Domain-Driven Design (DDD) architecture for the OGroup CAE platform, acting as a master blueprint for the backend and frontend engineering teams.

---

## 1. OVideo (Video Business Network & Digital Pages)

**1. Purpose**
A Digital Identity Layer. Every creator, business, clinic, or restaurant gets a dedicated OVideo page (e.g., ovideo.com/restaurant-name) optimized for conversion. The platform does NOT host videos; it acts as an aggregation and conversion layer for external links (TikTok, YouTube, Instagram, Facebook).

**2. Business Flow**
Viewer visits a business/creator OPage -> Watches an external video -> OAds injects a smart monetization layer based on context -> Viewer clicks CTA -> OFlow generates a Lead -> OInsights measures the conversion.

**3. Technical Flow**
Frontend resolves `slug` -> Fetches `Profile`, `Page`, and associated `Videos` -> Renders the page. Interactions trigger `TrackingService` events.

**4. Database Tables**
- `profiles` (id, type [creator, business, store, clinic], name, description, logo, location, phone, whatsapp, category, owner_id)
- `pages` (id, profile_id, slug, theme, settings)
- `videos` (id, profile_id, external_url, platform, title, category, views, engagement)

**5. APIs**
- `GET /api/v1/pages/{slug}` (Public Page Fetch)
- `POST /api/v1/pages` (Create/Update Page Settings)

**6. UI Screens**
- Public OPage (Business/Creator Landing Page)
- Page Editor & Customizer

**7. User Permissions**
- Owner: Customize page, add videos, update contact info.
- Public Viewer: View page, interact with CTAs, play videos.

**8. Validation Rules**
- Slugs must be unique, URL-safe, and lowercase.
- Videos must be valid URLs from supported platforms.

**9. Notifications**
- "Your OVideo Page is now live and ready to receive traffic."

**10. AI Features**
- **Smart Monetization Layer:** Dynamically injects related ads (OAds) based on the viewer's location, time of day, and the page's category.

**11. Reports**
- Page Views, CTA Click-Through Rate (CTR), Video Plays, Lead Generation Rate.

**12. Future Scalability**
- Heavy read traffic on public pages. Requires Redis caching for page data and CDN caching for static assets. Implement Edge Functions for fast global routing of OPages.

---

## 2. OAds (Campaign Manager)

**1. Purpose**
Customer Acquisition Campaign Manager connecting budgets to content.

**2. Business Flow**
Business sets budget -> Selects objective (e.g., WhatsApp Lead) -> AI suggests Creators/Videos -> Campaign launches -> Tracking begins.

**3. Technical Flow**
`CampaignService` creates campaign -> Deducts from `WalletBalance` (Hold) -> `MatchingEngine` queues creator invites -> Tracking endpoints generate `ImpressionEvent` / `ClickEvent`.

**4. Database Tables**
- `campaigns` (id, business_id, objective, budget, status, start_date, end_date)
- `campaign_targets` (campaign_id, city, age_min, age_max, interests)
- `campaign_creators` (campaign_id, creator_id, status)

**5. APIs**
- `POST /api/v1/campaigns`
- `GET /api/v1/campaigns/{id}/roi`

**6. UI Screens**
- Campaign Wizard (5-steps)
- Campaign Performance Dashboard
- Creator Matching Screen

**7. User Permissions**
- Business: Create/Manage campaigns.
- Admin: Approve/Reject high-budget campaigns.

**8. Validation Rules**
- Budget >= Minimum platform threshold.
- Wallet balance >= Budget.

**9. Notifications**
- "Campaign [Name] requires your approval" (To Creator).

**10. AI Features**
- **Campaign Optimization:** Auto-pauses underperforming ads.
- **Audience Matching:** Connects business category to creator audience graph.

**11. Reports**
- Real-time ROI, CPA (Cost Per Acquisition), CTR, Conversion Funnel.

**12. Future Scalability**
- Click/Impression tracking will receive massive throughput. Use Kafka or Redis Streams to ingest events before batch-writing to MySQL/ClickHouse.

---

## 3. OFlow (Enterprise CRM)

**1. Purpose**
Manage the full customer lifecycle from click to closed sale.

**2. Business Flow**
User clicks ad -> Lead generated -> Assigned to Sales Agent -> Agent calls/WhatsApp -> Moves to 'Won'.

**3. Technical Flow**
`LeadCaptureService` receives webhook -> `LeadRoutingRule` assigns agent -> `CRMEvent` logged to timeline.

**4. Database Tables**
- `leads` (id, campaign_id, business_id, status, source)
- `customers` (id, business_id, name, phone, ltv)
- `lead_activities` (id, lead_id, type [call, note, whatsapp], description)

**5. APIs**
- `POST /api/v1/crm/leads` (Public webhook for lead forms)
- `PATCH /api/v1/crm/leads/{id}/status`

**6. UI Screens**
- Kanban Board (New, Contacted, Appointment, Won)
- Customer 360 View & Timeline

**7. User Permissions**
- Sales Agent: View assigned leads, add notes.
- Business Owner: View all leads, reassign.

**8. Validation Rules**
- Phone numbers must be E.164 formatted.

**9. Notifications**
- "New Lead from [Campaign]" (Real-time WebSocket).

**10. AI Features**
- **Lead Scoring:** Predicts conversion probability based on source and time of day.

**11. Reports**
- Agent Performance, Lead-to-Sale Time, Pipeline Value.

**12. Future Scalability**
- Multi-tenant architecture using Foreign Keys (`business_id`) with Global Scopes in Laravel to ensure absolute data isolation.

---

## 4. OCommerce (Online Store)

**1. Purpose**
Direct e-commerce integration to close sales directly from ads.

**4. Database Tables**
- `products`, `orders`, `order_items`, `inventory`

**10. AI Features**
- Upsell recommendations based on Campaign source.

---

## 5. OBooking (Appointments)

**1. Purpose**
Schedule management for service-based businesses (clinics, salons).

**4. Database Tables**
- `services`, `schedules`, `appointments`

**10. AI Features**
- Smart scheduling (predicts no-shows).

---

## 6. OWallet (Financial Ledger)

**1. Purpose**
Manage commissions, deposits, and automated revenue splits.

**4. Database Tables**
- `wallets` (id, user_id, balance, type)
- `transactions` (id, wallet_id, amount, type [deposit, withdrawal, commission, campaign_fee], reference_id)

**10. AI Features**
- Fraud detection on anomalous withdrawal patterns.

---

## 7. Customer Identity Resolution (Progressive Profiling)

**1. Purpose**
To track end-users (customers) securely and intelligently across the OGroup ecosystem without requiring them to create an account initially. The system progressively builds a profile from anonymous interactions to verified identities.

**2. The 3-Phase Identity Flow**

*   **Phase 1: Anonymous Tracking (The Shadow Profile)**
    *   When a user first visits any OPage, a unique `guest_id` (Device Fingerprint/Cookie) is generated.
    *   **Data Captured:** Geo-location (via IP/Cloudflare Headers), Device Type, Page Views, Video Watch Time, Categories Browsed.
    *   **Usage:** OAds uses this anonymous behavioral data to serve highly targeted view-based ads.

*   **Phase 2: Value Exchange (Conversion Triggers)**
    *   The user is prompted with an action (e.g., "Click here for a 20% discount on WhatsApp", "Book a Free Consultation").
    *   When the user clicks a WhatsApp CTA, the intent is captured. If they send a message, the integrated Business WhatsApp API captures their *real* phone number.
    *   If they fill out a quick Lead Form or Booking, they manually provide Name and Phone Number.

*   **Phase 3: Identity Merging (Profile Resolution)**
    *   The system matches the newly acquired explicit data (Phone Number) with the existing `guest_id`.
    *   The "Shadow Profile" is merged into a verified `Customer Record` in OFlow (CRM).
    *   All historical views and clicks are now permanently attached to the real customer timeline.

**3. Technical Implementation**
- `guest_sessions` table (guest_id, ip_hash, geo_data, user_agent, created_at)
- `session_events` table (guest_id, event_type [view, click], reference_id, metadata)
- `TrackingMiddleware` intercepts public traffic and injects/reads the `guest_id` cookie.
- `IdentityResolutionJob` runs asynchronously when a Lead is created to merge the `guest_id` history with the new `customer_id`.

---

*Note: For the full detailed specifications of all modules, refer to the internal Confluence/Wiki. This document serves as the high-level Architectural Blueprint for the MVP development phase.*
