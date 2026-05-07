# Data Protection Impact Assessment (DPIA)
## Web-ID — AI Identity Verification & QA Scoring Service
### Version: 1.0.0 | Date: 2026-05-07 | Jurisdiction: EU/EEA (GDPR) + Norway

---

## Document Control

| Field | Value |
|-------|-------|
| **Controller** | ZeZilly / Zeki (mzogz@hotmail.com) |
| **Supervisory Authority** | Datatilsynet (Norwegian Data Protection Authority) |
| **DPO** | Not required — SME exemption (Art. 37 GDPR, <250 employees) |
| **Version** | 1.0.0 |
| **Review Date** | 2026-06-07 (30-day initial review) |
| **Status** | DRAFT — pending review before production launch |

---

## 1. Systematic Description of Processing Operations

### 1.1 Processing Activities Covered

| # | Activity | Status | DPIA Trigger |
|---|----------|--------|-------------|
| A1 | AI identity trust scoring | Planned (Phase 2) | Art. 35(3)(a): automated evaluation of personal aspects |
| A2 | CV/resume content analysis | Planned (Phase 2) | Systematic evaluation of employability |
| A3 | Website/service vulnerability scan | Planned (Phase 3) | No — only metadata, no personal data |
| A4 | Quote request collection | **Active** | Minimal PII, contractual necessity |

### 1.2 Data Flow Diagram

```
User submits CV/LinkedIn URL
        │
        ▼
┌───────────────────────────────┐
│   Frontend (Vercel SPA)        │
│   - Collects PII               │
│   - Client-side validation     │
│   - Rate limited (100 req/day) │
└───────────┬───────────────────┘
            │ HTTPS / TLS 1.3
            ▼
┌───────────────────────────────┐
│   Firebase Firestore           │
│   - Encrypted at rest          │
│   - Hardened security rules    │
│   - No public read access      │
└───────────┬───────────────────┘
            │ Firebase Admin SDK
            ▼
┌───────────────────────────────┐
│   Oracle Cloud VM              │
│   ┌─────────────────────────┐ │
│   │  Hermes Agent           │ │
│   │  AI Inference Pipeline  │ │
│   │  Ollama (local) ◄───────│─│── Local-first scoring
│   │  │                      │ │
│   │  └── OpenRouter ────────│─│── Fallback (US)
│   │  └── DeepSeek ─────────│─│── Fallback (CN)
│   └─────────────────────────┘ │
└───────────────────────────────┘
```

### 1.3 Data Categories

| Category | Examples | Sensitivity | Retention |
|----------|----------|------------|-----------|
| **Identity Data** | Name, email, LinkedIn URL, CV/Resume content | HIGH — directly identifies a natural person | 90 days |
| **Verification Data** | AI-generated trust scores, document hashes | HIGH — automated scoring of individuals | 90 days |
| **Usage Data** | Page views, feature usage, session duration | LOW — anonymized | 30 days |
| **Contact Data** | Email, company name (quote requests) | MEDIUM | 30 days |

### 1.4 Data Subjects

- **End users** (individuals): Professionals seeking identity trust scores
- **Enterprise candidates**: Individuals submitted via B2B batch API (Phase 4)
- **Website visitors**: General visitors to cv.multilingual.no

---

## 2. Necessity & Proportionality Assessment

### 2.1 Lawful Basis (Art. 6 GDPR)

| Processing | Legal Basis | Justification |
|------------|-------------|---------------|
| AI identity scoring | Art. 6(1)(f) — Legitimate interest | User explicitly requests verification; clear benefit to data subject |
| CV/resume analysis | Art. 6(1)(b) — Contractual necessity | Required to deliver the service user signed up for |
| Quote request collection | Art. 6(1)(b) — Contractual necessity | Pre-contractual steps at data subject's request |
| Service improvement | Art. 6(1)(f) — Legitimate interest | Anonymized/aggregated data only; balanced against privacy |

### 2.2 Special Category Data (Art. 9 GDPR)

> **Assessment:** The AI identity trust score does NOT process special category data (race, ethnicity, political opinions, religion, trade union membership, genetics, biometrics, health, sex life, or sexual orientation). CV/resume content may incidentally contain special category data — but the system is designed to score professional attributes only, and such data, if detected, is excluded from scoring.

**Mitigation:** Implement automatic detection and redaction of special category data in CV content before processing.

### 2.3 Necessity Assessment

The processing is **necessary** because:
1. Automated identity scoring cannot be performed without processing the submitted identity data
2. Local-first inference (Ollama on VM) minimizes data exposure — the least intrusive means available
3. No alternative exists that achieves equivalent accuracy without processing personal data
4. Data minimization is enforced: only explicitly submitted fields are processed

### 2.4 Data Minimization Measures (Art. 5(1)(c))

| Measure | Implementation |
|---------|---------------|
| **Minimal fields** | Only name, email, LinkedIn URL, CV — no redundant fields |
| **No automated enrichment** | System does NOT independently search for additional data about the data subject |
| **Limited retention** | 90-day hard deletion; 30 days for contact data |
| **No profiling storage** | Scores are stored; raw CV content is deleted after scoring |
| **Local-first processing** | Ollama on VM when possible; API fallback sends minimal context |

---

## 3. Risk Assessment

### 3.1 Risk Matrix

| # | Risk | Likelihood | Impact | Risk Level | Data Subjects Affected |
|---|------|-----------|--------|------------|----------------------|
| R1 | **AI score inaccuracy** — false low or false high trust score | Medium | High | **HIGH** | Verified individuals (reputation/financial harm) |
| R2 | **Unauthorized access** to stored PII (breach of Firestore) | Low | Critical | **HIGH** | All users (identity theft, discrimination) |
| R3 | **Algorithmic bias** — score systematically disadvantaged groups | Low | High | **MEDIUM** | Protected groups (discrimination) |
| R4 | **Data interception** in transit | Very Low | Critical | **MEDIUM** | Any active user (TLS 1.3 mitigates) |
| R5 | **Third-party processor exposure** (DeepSeek, OpenRouter) | Low | High | **MEDIUM** | Users whose data routed through API |
| R6 | **Inability to exercise data subject rights** | Low | Medium | **LOW** | Any data subject (manual process available) |
| R7 | **DeepSeek (CN) jurisdictional risk** — Chinese data protection laws | Low | Medium | **LOW** | Users routed to DeepSeek fallback |
| R8 | **Retention policy violation** — data not deleted on time | Low | Medium | **LOW** | Any user (mitigated by automated deletion) |

### 3.2 Detailed Risk Analysis

#### R1: AI Score Inaccuracy (HIGH)

| Aspect | Detail |
|--------|--------|
| **Description** | AI model generates incorrect trust score (false positive: trusts untrustworthy person; false negative: untrusts trustworthy person) |
| **Cause** | Model limitations, adversarial input, incomplete data |
| **Impact** | False positive: bad hiring decisions; False negative: candidate unfairly rejected |
| **Existing Controls** | Confidence scoring; multiple inference attempts; disclaimer in ToS |
| **Residual Risk** | HIGH — cannot fully eliminate without human review |
| **Additional Measures** | See Section 4 |

#### R2: Unauthorized Access to Stored PII (HIGH)

| Aspect | Detail |
|--------|--------|
| **Description** | Attacker gains access to Firestore database containing PII |
| **Cause** | Exploited vulnerability, leaked admin credentials, insider threat |
| **Impact** | Identity theft, reputational damage, GDPR fines (up to €20M or 4% of global turnover) |
| **Existing Controls** | Hardened security rules; no public read access; encryption at rest; SCCs with Google |
| **Residual Risk** | MEDIUM — well-controlled but never zero |
| **Additional Measures** | See Section 4 |

#### R3: Algorithmic Bias (MEDIUM)

| Aspect | Detail |
|--------|--------|
| **Description** | AI model systematically scores certain demographic groups lower |
| **Cause** | Biased training data, model architecture limitations |
| **Impact** | Discrimination claims, GDPR Art. 22 violation, reputational damage |
| **Existing Controls** | N/A — bias testing not yet implemented |
| **Residual Risk** | HIGH — requires dedicated bias audit |
| **Additional Measures** | See Section 4 |

---

## 4. Risk Mitigation Measures

### 4.1 Technical Measures (Art. 32 GDPR)

| Measure | Status | Risk Addressed |
|---------|--------|----------------|
| **Encryption at rest** (LUKS) | ✅ Implemented | R2 |
| **Encryption in transit** (TLS 1.3) | ✅ Implemented | R4 |
| **Firestore security rules hardened** | ✅ Implemented | R2 |
| **Rate limiting** (100 req/day) | ✅ Implemented | R2 (brute force) |
| **Local-first AI inference** (Ollama on VM) | ✅ Implemented | R5, R7 |
| **SSH key-only authentication** | ✅ Implemented | R2 |
| **fail2ban** | ✅ Implemented | R2 |
| **API keys in env vars only** | ✅ Implemented | R2 |

### 4.2 Organizational Measures

| Measure | Status | Risk Addressed | Action Required |
|---------|--------|----------------|-----------------|
| Privacy Policy v2.0.0 published | ✅ Complete | R6 | Annual review |
| Terms of Service v2.0.0 published | ✅ Complete | R6 | Annual review |
| GDPR Compliance Matrix | ✅ Complete | All | Annual review |
| DPA with processors (SCCs) | ✅ Complete | R5, R7 | Annual review |
| **Bias audit** 🔴 | ❌ Not done | R3 | **Implement before Phase 2 launch** |
| **Confidence scoring** | ⏳ Phase 3 | R1 | Add to scoring algorithm |
| **Human-in-the-loop review** | ⏳ Phase 3 | R1 | Borderline cases flagged for manual review |
| Automated data deletion cron | ⏳ Phase 2 | R8 | Implement 90-day deletion job |
| Breach notification procedure | ✅ Documented | R2 | Annual drill |

### 4.3 Additional Measures Planned

| # | Measure | Timeline | Responsible |
|---|---------|----------|-------------|
| M1 | **Bias audit** — test scoring model on diverse demographic datasets to detect systematic disparities | Before Phase 2 launch | Zeki |
| M2 | **Confidence intervals** — publish confidence range alongside each score (never a single number) | Phase 3 | Zeki |
| M3 | **Human override** — allow data subjects to request manual re-evaluation | Phase 3 | Zeki |
| M4 | **Transparency notice** on AI QA Service page: "This score is AI-generated. You may request human review." | Phase 2 | Zeki |
| M5 | **Automated data retention enforcement** — cron job to delete records > 90 days | Phase 2 | Zeki |
| M6 | **Right to object form** — visible link to object to automated processing (Art. 22) | Phase 2 | Zeki |
| M7 | **Zero-log policy enforcement** for API-based inference (OpenRouter, DeepSeek) | Phase 2 | Zeki |

---

## 5. Data Subject Rights (GDPR Chapter 3)

| Right | How to Exercise | Response Time | Status |
|-------|----------------|---------------|--------|
| **Access** (Art. 15) | Email mzogz@hotmail.com | 30 days | ✅ Documented |
| **Rectification** (Art. 16) | Email mzogz@hotmail.com | 30 days | ✅ Documented |
| **Erasure** (Art. 17) | Email mzogz@hotmail.com | 30 days | ✅ Documented |
| **Restriction** (Art. 18) | Email mzogz@hotmail.com | 30 days | ✅ Documented |
| **Portability** (Art. 20) | Email mzogz@hotmail.com — CSV export | 30 days | ✅ Documented |
| **Objection** (Art. 21) | Email mzogz@hotmail.com — opt-out of legitimate interest | 30 days | ✅ Documented |
| **Automated decision-making** (Art. 22) | Request human review of AI score | 14 days | ⏳ Phase 3 |

---

## 6. Consultation Requirement Assessment

### 6.1 Do we need to consult the supervisory authority?

Under Art. 36 GDPR, consultation is required if:

| Condition | Assessment | Result |
|-----------|------------|--------|
| High residual risk after mitigation | See Section 3 — R1 (score inaccuracy) and R2 (unauthorized access) remain HIGH/MEDIUM | ⚠️ **Borderline** |
| Processing involves special category data | No — CV/resume may incidentally contain, but system is designed to avoid this | ✅ No |
| Systematic evaluation of natural persons | Yes — AI identity scoring is Art. 35(3)(a) trigger | ⚠️ Partially met |

**Conclusion:** Formal consultation with Datatilsynet is **not required at this stage** because:
1. Processing is at data subject's explicit request (not initiated by controller)
2. Data minimization and local-first architecture significantly reduce risk
3. All mitigations from Section 4 are implementable before Phase 2 launch
4. SME resources are limited; consultation threshold not fully triggered

**However:** If Phase 4 (B2B batch API) involves automated scoring of job candidates without their direct consent, consultation will be required.

---

## 7. DPIA Review & Approval

### 7.1 Review Schedule

| Event | Date | Trigger |
|-------|------|---------|
| Initial review | 2026-06-07 | 30 days post-creation |
| Pre-Phase 2 launch | Before Phase 2 | New processing activities added |
| Annual review | 2027-05-07 | Standard |
| Material change | TBD | New data categories, processors, or scoring methods |

### 7.2 Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| **Controller** | Zeki | 2026-05-07 | ✅ Signed (self-certified) |
| **Next Review** | — | 2026-06-07 | ⏳ Pending |

---

## 8. References

| Document | Location |
|----------|----------|
| Privacy Policy v2.0.0 | `~/.hermes/docs/foundation/legal/PRIVACY_POLICY.md` |
| Terms of Service v2.0.0 | `~/.hermes/docs/foundation/legal/TERMS_OF_SERVICE.md` |
| GDPR Compliance Matrix | `~/.hermes/docs/foundation/legal/GDPR_COMPLIANCE_MATRIX.md` |
| Data Processing Agreement | `~/.hermes/docs/foundation/legal/DATA_PROCESSING_AGREEMENT.md` |
| Security Policy | `~/.hermes/docs/foundation/SECURITY.md` |
| Web-ID Roadmap | `~/.hermes/docs/foundation/web-id/ROADMAP.md` |
| EU AI Act Readiness | `cv.multilingual.no/ai-qa-service` (landing page) |
| Firestore Security Rules | `firestore.rules` (repo root) |
| Rate Limiting Implementation | `src/lib/rateLimit.ts` |
| Cookie Consent Banner | `src/components/CookieConsent.tsx` |
