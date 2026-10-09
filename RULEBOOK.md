# RULEBOOK.md

**Status:** DRAFT v1, prepared by the Rules Architect role from the AppBuildersPH Hackathon 2026 Participant Briefing (dated October 9, 2026). Authoritative source: `OFFICIAL_BRIEF.md`. If organizers clarify anything, update the brief first, then this file.

**Owners:** Brian (Product + Demo captain), Andrei (Build captain), Christian (Quality captain).

**Conventions:** Page numbers refer to the footers of the 29-page briefing deck. Times are assumed to be Philippine time (see Q3). Every rule below is `Confirmed` unless marked `Ambiguous`.

---

## 1. Numbered rules

| ID | Requirement | Type | Source | Evidence required | Owner | Status |
|---|---|---|---|---|---|---|
| R1 | Only participants listed on appbuildersph.com/hackathon may compete. Members not on the official list are disqualified. | Eligibility | pp. 12, 23 | Screenshot of the official list showing every team member | Brian | Confirmed |
| R2 | Teams have 1 to 4 members (solo allowed). A person may be on only one team, and a team may submit only one project. Team name or membership may change if the submitted names match the official website list. Only member names in the submission count. | Eligibility | pp. 11, 23, 28 | Final team name and member list matching the site | Brian | Confirmed |
| R3 | The project must be substantially built during the hackathon. A pre-existing project is grounds for disputing results. Any existing code or assets must be disclosed. | Build constraint / Prohibited action | pp. 9, 13, 22, 27 | Public repo whose history starts after building begins; written list of reused code, boilerplate, and assets | Andrei | Confirmed (start time: see Q1) |
| R4 | No external help from people outside the hackathon (grounds for disqualification). AI-assisted development and Devin are allowed and must be disclosed. | Prohibited action | pp. 12, 13, 22 | Disclosure of AI tools used; all contributions come from registered members | Brian | Confirmed |
| R5 | No fake benchmarks (grounds for disputing results). | Prohibited action | pp. 13, 27 | Eval script and raw results committed to the repo; synthetic data described honestly | Christian | Confirmed |
| R6 | A meaningful part of AI inference must execute locally on the user's device. Core Local AI functionality must work without depending entirely on a cloud AI API. | Build constraint | pp. 5, 6, 9, 22 | Demo with networking disabled; architecture note stating which models run where | Andrei | Confirmed |
| R7 | The product must be a working product, demonstrated. | Build constraint / Judging | p. 9 | Live demo on the team laptop; run from a fresh clone | Christian | Confirmed |
| R8 | Cloud APIs are allowed only as secondary components. | Build constraint | pp. 9, 22 | List of any cloud services used, or an explicit "none" | Andrei | Confirmed |
| R9 | Models, APIs, frameworks, and major tools must be disclosed. Open-source models and libraries are allowed. No specific model, framework, OS, or hardware is required, and PCs, laptops, phones, and edge hardware all count. | Build constraint / Submission | pp. 6, 9, 10, 22, 24 | Disclosure list with names and versions | Andrei | Confirmed |
| R10 | The submission must include a project name, short description, team members, and a public GitHub repository. | Submission | p. 16 | Completed form fields | Brian | Confirmed |
| R11 | The submission must include proof: a demo video (ideally about 1 minute), the URL of an X or LinkedIn video post (tag Devin / Cognition and include #AppBuildersPH), what runs locally, and what requires internet. | Submission | pp. 16, 24 | Video file, live post URL, written local-vs-internet statement | Brian | Confirmed (length is "ideally") |
| R12 | The submission must include disclosures: models used, technologies and frameworks, APIs and cloud services, existing code and assets, and AI development tools. | Submission | p. 16 | Disclosure section in the submission | Andrei | Confirmed |
| R13 | Every submission must answer: "Why does this product benefit from running AI locally?" | Submission | pp. 16, 25 | Written answer in the submission, repeated in the pitch | Brian | Confirmed |
| R14 | Submit once, on the Cerebral Valley event page, by 10:00 AM on October 10. No extensions. No edits or resubmissions. | Deadline / Submission | pp. 16, 25, 29 | Submission confirmation, checked before the deadline | Brian | Confirmed |
| R15 | The GitHub repository must be public by the deadline. Code freezes at 10:00 AM, and judges review the repo as of the deadline. | Deadline / Build constraint | p. 25 | Repo opens in a logged-out browser; no commits after 10:00 AM | Andrei | Confirmed |
| R16 | The app does not need to be deployed live, but the repository must contain instructions for judges to recreate it. | Submission | p. 28 | README with install, model download, and run steps, tested from a clean clone | Andrei writes, Christian tests | Confirmed |
| R17 | To be a finalist, a team member must be present in person at Cyberzone, SM Makati on October 10 to pitch and answer Q&A. Remote pitching is not allowed. Finalists (10 to 15 teams) are announced at 1:00 PM. Bring your own laptop; Wi-Fi, power, HDMI, and USB-C are available. | Eligibility / Deadline | pp. 11, 20, 26, 28 | Named on-site presenter; laptop with models preinstalled | Brian | Confirmed |
| R18 | Each pitch is 5 minutes (pitch and live demo) plus 3 minutes of judge Q&A. | Judging | pp. 15, 27 | Timed rehearsal | Brian | Confirmed |
| R19 | Projects are scored on the weighted criteria in section 2. | Judging | p. 14 | See section 2 | Brian | Confirmed |
| R20 | Results can be disputed if a team is proven to have violated the rules, including pre-existing project, external help, and fake benchmarks ("including but not limited to"). | Prohibited action | pp. 13, 27 | Covered by evidence for R3, R4, R5 | Brian | Confirmed |
| R21 | Questions during the build go to the official Telegram group chat. | Process | p. 24 | Log any answer received in `OFFICIAL_BRIEF.md` | Brian | Confirmed |

---

## 2. Judging-criteria map

| Criterion | Weight | What the organizers ask | Evidence the team should show |
|---|---|---|---|
| Problem & Usefulness | 25% | Does it solve a genuine problem for a clear target user? | One named user and moment (PROJECT_CONTRACT), live before/after, honest framing of the scenario |
| Local AI Implementation | 25% | Is local inference fundamental, and does it give a meaningful advantage? | Demo with networking off, visible offline indicator, local-vs-internet table, the "why local" answer (R13) |
| Technical Execution | 20% | Does it work, reliably enough for a live demonstration? | Fresh-clone run, tested fallbacks, real eval results (R5) |
| Innovation | 15% | Is it meaningfully different? Does Local AI enable something new? | The differentiators approved in PROJECT_CONTRACT (evidence-linked fields and any approved additions) |
| Product & Demo Quality | 15% | Is the UX usable and the live demonstration convincing? | Three-screen flow, `DEMO_RUNBOOK.md`, rehearsed 5-minute pitch, 1-minute video |

Organizer note: half the score is usefulness plus how real the Local AI is.

---

## 3. Questions for organizers (Ambiguous items)

| # | Question | Why it matters | Status |
|---|---|---|---|
| Q1 | Page 4 labels the challenge reveal "1:00 PM", but the Build Day schedule (page 3) lists the reveal at 2:00 PM and "Building begins" at 2:30 PM. Which is official, and may teams do planning (role assignment, idea selection) before building begins? | Decides when the repo and code may start (R3) | Ambiguous |
| Q2 | Is it acceptable that AI chat tools were used for brainstorming and planning before building began? | Possible overlap with R3 and R4 | Ambiguous |
| Q3 | Is the 10:00 AM deadline Philippine time? | Deadline safety (R14) | Ambiguous (assumed PHT) |
| Q4 | Is the demo video uploaded to the submission form, or is the X/LinkedIn post URL enough? | Submission completeness (R11) | Ambiguous |
| Q5 | Do the special awards (AMD, WhiteCloak, Cognition / Devin, Tutorials Dojo, People's Choice) have criteria beyond the main scoring, such as required hardware or tools? | Whether to target any of them | Ambiguous |

Until Q1 is answered, treat **2:30 PM, October 9** as the earliest time to create the repository or write code.

---

## 4. Final-submission checklist (last 30 minutes)

```text
[ ] All team members are on the official website list; team name matches (R1, R2)
[ ] Repo is public and opens logged-out (R15)
[ ] README recreates the project from a clean clone; Christian tested it (R16)
[ ] Final commit made before 10:00 AM; its hash is written down (R15)
[ ] Project name, short description, and members entered (R10)
[ ] ~1-minute demo video recorded (R11)
[ ] Video posted on X or LinkedIn, tagging Devin / Cognition, with #AppBuildersPH; URL copied (R11)
[ ] "What runs locally / what requires internet" written (R11)
[ ] Disclosures complete: models, frameworks, APIs and cloud, existing code and assets, AI dev tools including Devin and Claude (R9, R12)
[ ] "Why does this product benefit from running AI locally?" answered (R13)
[ ] Every number in the submission matches raw results in the repo (R5)
[ ] Submitted on the Cerebral Valley page; reopened to verify; no resubmission possible (R14)
[ ] On-site presenter and laptop (models preinstalled) confirmed for Demo Day (R17)
```

---

## 5. Do not accidentally do this

- Create the repository or write project code before the confirmed building start (R3, Q1).
- Reuse earlier code, templates, or assets without disclosing them (R3, R12).
- Ask anyone outside the registered team for help with the build (R4).
- Present benchmark or accuracy numbers that did not come from the committed eval script (R5).
- Let a cached or replayed result appear live without labeling it as such (R5, R7).
- Depend on a cloud AI API for the core workflow (R6, R8).
- Use real patient data in the demo or eval data.
- Push commits after 10:00 AM, or leave the repo private (R15).
- Submit early without double-checking, since there are no edits (R14).
- Count on venue Wi-Fi or a fresh model download during the pitch (R6, R17).
- Forget the video post tags: Devin / Cognition and #AppBuildersPH (R11).
- Assume a teammate not on the official list can compete (R1).

NEXT OWNER: Product captain (Brian).
