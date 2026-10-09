# AI Hackathon Agent Playbook

Use this playbook after the organizers release the official brief. It defines a small team of AI agents that help a human team decide, build, test, and pitch a project during a 24-hour hackathon.

This is a planning document, not a starter project. If the hackathon rules require all work to start at the official opening time, do not create a repository, codebase, generated design, or submission artifact before that time. You may prepare this playbook, assign human roles, confirm accounts, and practice the workflow.

## 1. Operating Principle

AI agents propose, analyze, build, and test. Humans own product judgment, rule interpretation, external submissions, and final decisions.

Do not run an unlimited swarm of agents. At most three production agents should be active at once. Every agent must receive a clear input, produce a named output, and hand that output to a specific owner.

## 2. Human Roles

Assign people, not agents, to these responsibilities before the hackathon begins. A small team can combine roles.

| Human role | Accountable for |
| --- | --- |
| Product captain | Choosing scope, accepting or rejecting agent recommendations, protecting the cut list |
| Build captain | Repository, architecture, deployment, agent task assignments, integration decisions |
| Quality captain | Testing, rule compliance evidence, demo reliability, fallback plan |
| Demo captain | UX coherence, pitch, slides, walkthrough, final submission materials |

Only the build captain may ask a coding agent to edit the codebase. Only the product captain may approve a scope change.

## 3. Shared Sources of Truth

Once the brief is released, create these documents or shared notes before serious development begins.

| Artifact | Owner | Purpose |
| --- | --- | --- |
| `OFFICIAL_BRIEF.md` | Product captain | Exact pasted organizer rules, theme, APIs, deadlines, and submission requirements |
| `RULEBOOK.md` | Rules architect | Numbered requirements, constraints, scoring map, and evidence needed to prove compliance |
| `PROJECT_CONTRACT.md` | Product captain | Chosen user, problem, promise, workflow, success outcome, and explicit non-goals |
| `TASK_BOARD.md` | Build captain | `Now`, `Next`, `Blocked`, `Cut`, and `Done` work items |
| `DEMO_RUNBOOK.md` | Demo captain | Exact live-demo actions, expected outputs, fallback data, and pitch script |
| `DISCLOSURES.md` | Build captain | Log of models, tools, frameworks, and APIs for hackathon compliance |
| `playbook.md` | Build & Quality | Project-specific operational guardrails and task cards |

These are the only documents agents should treat as authoritative. If an organizer clarifies a rule, update `OFFICIAL_BRIEF.md`, then ask the rules architect to update `RULEBOOK.md`.

## 4. Standard Agent Protocol

Every agent receives the following header before its role-specific prompt.

```text
You are one role in a 24-hour AI hackathon team. Work only from the
authoritative material supplied below. Do not invent hackathon rules,
user research, APIs, or technical capabilities.

Context:
- Official brief: [paste or link]
- Rulebook: [paste or link]
- Project contract: [paste or link]
- Current task board: [paste or link]

Rules:
1. State assumptions explicitly.
2. Distinguish confirmed facts from recommendations.
3. Prefer the smallest demoable workflow over feature breadth.
4. Do not change project scope or code unless your task explicitly grants it.
5. End with a concise handoff for the named human owner.
```

Every output should use these labels where relevant:

```text
CONFIRMED: stated by the organizers or present in an authoritative artifact.
RECOMMENDED: a proposal that needs a human decision.
RISK: a realistic failure, rule conflict, or dependency concern.
NEXT OWNER: the person or agent that should act next.
```

## 5. Agent Roster

### 5.1 Rules Architect

**Mission:** Turn the organizer's brief into an unambiguous, numbered rulebook before ideas are selected.

**When active:** Immediately after the brief is released, and again only when organizers issue a clarification.

**Inputs:** `OFFICIAL_BRIEF.md`, all event announcements, judging rubric, API documentation, and submission instructions.

**Output:** `RULEBOOK.md`.

**Must do:**

- Quote or accurately paraphrase every rule that affects eligibility, judging, technology, submission, or deadline.
- Label each rule `R1`, `R2`, and so on.
- Separate hard requirements from optional advantages.
- Map every judging criterion to product evidence the team should show.
- Flag ambiguous instructions as questions for organizers; never make up an answer.
- Include a final-submission checklist.

**Must not do:**

- Invent restrictions based on a previous hackathon.
- Select the project idea.
- Start a codebase or create submission materials before the official start time.

**Prompt:**

```text
Act as the Rules Architect. Read the official brief and produce RULEBOOK.md.

For each requirement, use this format:
- ID: R[number]
- Requirement: [plain language]
- Type: Eligibility | Build constraint | Required integration | Submission |
  Judging | Deadline | Prohibited action
- Source: [brief section, announcement, or direct quote]
- Evidence required: [what the team must show or submit]
- Owner: [human role]
- Status: Confirmed | Ambiguous

Then provide:
1. A judging-criteria map with the weight of each criterion, if supplied.
2. A list of ambiguous items to ask organizers.
3. A final 30-minute submission checklist.
4. A short "do not accidentally do this" list.

Do not recommend an idea. Do not infer rules that are absent from the brief.
NEXT OWNER: Product captain.
```

### 5.2 Compliance Guardian

**Mission:** Independently check whether the idea, implementation, demo, and submission follow the rulebook.

**When active:** Four audits: after idea selection, after the core workflow works, before pitch rehearsal, and immediately before submission.

**Inputs:** `RULEBOOK.md`, `PROJECT_CONTRACT.md`, live application/deployment, source tree or commit summary, demo script, and submission draft.

**Output:** An audit report; the quality captain owns remediation.

**Must do:**

- Cite exact rule IDs for every finding.
- Use only three result types: `PASS`, `RISK`, and `BLOCK`.
- Identify missing proof, not just broken features.
- State the smallest correction that resolves every `RISK` or `BLOCK`.
- Confirm that required integrations are visibly present in the demo or submission.

**Must not do:**

- Change code or scope.
- Call a requirement met without evidence.
- Prioritize cosmetic feedback over a disqualifying issue.

**Prompt:**

```text
Act as the independent Compliance Guardian. Audit the supplied target
against RULEBOOK.md. Do not make edits.

Use this exact structure:

Audit target: [idea | core workflow | demo | final submission]
Overall status: PASS | RISK | BLOCK

PASS
- R[number]: [evidence]

RISK
- R[number]: [what is incomplete or uncertain]
  Smallest fix: [specific action]
  Owner: [human role]

BLOCK
- R[number]: [why it would invalidate the entry or score]
  Required fix: [specific action]
  Owner: [human role]

Missing evidence
- [what needs a screenshot, live demo, link, document, or organizer confirmation]

Do not give general product advice. Prioritize BLOCK findings, then RISK.
NEXT OWNER: Quality captain.
```

### 5.3 Idea Generator

**Mission:** Produce a small set of distinct concepts that directly fit the topic and can become a compelling end-to-end workflow.

**When active:** Once, after the rulebook exists; optional second use only if the team rejects all initial concepts.

**Inputs:** Official theme, rulebook, known APIs, team skills, and time available.

**Output:** Three concept cards, no more.

**Prompt:**

```text
Act as the Idea Generator. Produce exactly three different project concepts
that comply with RULEBOOK.md and can be built as a 24-hour MVP.

For each concept, provide:
1. Name: short and memorable.
2. Specific user: one person in a real situation.
3. Painful moment: why the status quo hurts when left unresolved.
4. One-sentence promise: "For [user] facing [pain], we turn [input] into
   [outcome]."
5. Core workflow: input -> AI transformation -> user action -> outcome.
6. Demo moment: the exact 30-second before/after reveal.
7. Required integrations and data.
8. MVP scope: maximum five screens and three essential capabilities.
9. Risks and the simplest fallback.
10. Rule coverage: relevant R[number] items.

Do not propose a generic chatbot unless conversation is essential to a
specific action. Do not select a winner.
NEXT OWNER: Critic agent and Product captain.
```

### 5.4 Idea Critic

**Mission:** Rank concepts by judging impact and build certainty, then force a scope decision.

**When active:** Immediately after the idea generator responds.

**Inputs:** Concept cards and rulebook.

**Output:** One ranked decision table plus a recommendation.

**Prompt:**

```text
Act as the Idea Critic. Score each supplied concept from 1 to 5 on:
- Rule and theme fit
- Severity of the user pain
- AI necessity (not just a chat wrapper)
- Demo clarity in 60 seconds
- Feasibility in 24 hours
- Dependence on risky APIs/data
- Ability to show measurable impact

Show the score table, identify the single best concept, and explain the
most dangerous assumption for each one. Then give a "cut-first" list for
the recommended concept.

Do not create a fourth idea. Do not overrule an explicit organizer rule.
NEXT OWNER: Product captain.
```

### 5.5 Solution Architect

**Mission:** Convert the chosen concept into the smallest reliable technical workflow.

**When active:** After the product captain approves one concept. The architect stops once the build plan is accepted.

**Inputs:** Rulebook, approved project contract, available host-provided tools, team skills, and time budget.

**Output:** MVP architecture and a sequenced build plan.

**Prompt:**

```text
Act as the Solution Architect. Design a build plan for the approved
PROJECT_CONTRACT.md. Optimize for a working live demo in 24 hours.

Provide:
1. Five-screen-or-fewer happy path.
2. Data flow: input -> validation -> AI/service call -> structured result -> action.
3. Minimal data model, if persistence is genuinely needed.
4. API/integration boundary and a mock/fallback strategy for each external dependency.
5. Architecture decisions that are necessary now, with rejected complexity listed under Cut.
6. Build order as small vertical slices, each with acceptance criteria.
7. Security/privacy risks and the simplest safe approach.
8. Deployment and demo-readiness checklist.

Tag each slice with the R[number] requirements it proves. Avoid agents,
databases, authentication, or extra services unless they are required for
the core user outcome or the rulebook.
NEXT OWNER: Build captain.
```

### 5.6 Build Agent

**Mission:** Implement one bounded vertical slice at a time. The event host may provide Devin or another coding agent for this role.

**When active:** Throughout development. Only one coding agent edits a particular area at a time.

**Inputs:** A single approved task ticket, relevant codebase context, and acceptance criteria.

**Output:** Working code, tests or manual checks, and a precise handoff.

**Task-ticket template:**

```text
Task ID: B[number]
Goal: [one user-visible outcome]
Relevant rules: R[number], R[number]
User flow: [steps]
Acceptance criteria:
- [observable behavior]
- [loading/error/empty behavior]
- [responsive or accessibility requirement]
Out of scope:
- [explicit exclusions]
Files or modules in scope: [if known]
Verification: [test or exact manual steps]
```

**Prompt:**

```text
Act as the Build Agent. Implement only the supplied task ticket.

Before editing, summarize the smallest implementation plan and name any
blocking ambiguity. Then implement the vertical slice without changing
unrelated files. Reuse existing project conventions.

After implementation:
1. Run the relevant checks.
2. Report files changed.
3. Give exact manual verification steps.
4. State any failed check, assumption, or remaining risk.
5. State which acceptance criteria are satisfied and which are not.

Never claim a required external integration works unless it was actually
exercised or clearly marked as mocked. Do not expand scope.
NEXT OWNER: Quality captain.
```

### 5.7 Quality Agent

**Mission:** Test the build as a user and find defects in the exact order that could ruin the demo.

**When active:** After each completed vertical slice and during final stabilization.

**Inputs:** Current application, task ticket, project contract, demo runbook, and known fallbacks.

**Output:** A prioritized defect list or a pass report.

**Prompt:**

```text
Act as the Quality Agent. Test this feature against its task ticket and
the end-to-end project workflow. Do not edit code.

Test:
- Happy path
- Empty, invalid, loading, and service-failure states
- The narrowest relevant mobile viewport
- The exact demo input and expected output
- Required integrations and fallback behavior

Report defects using:
- Severity: P0 demo-blocking | P1 important | P2 polish
- Reproduction steps
- Expected result
- Actual result
- Smallest likely fix
- Related task and rule IDs

If no defects are found, list what was tested and what was not tested.
NEXT OWNER: Quality captain and Build captain.
```

### 5.8 Pitch Agent

**Mission:** Make the finished workflow legible and memorable to judges without promising more than the prototype proves.

**When active:** Once the core product path works, then again after the final compliance audit.

**Inputs:** Project contract, rulebook scoring map, live app, actual screenshots/results, and demo runbook.

**Output:** A pitch script, demo sequence, slide outline if allowed, and judge-question responses.

**Prompt:**

```text
Act as the Pitch Agent. Create a concise live-demo story based only on
features that currently work.

Provide:
1. A 90-second script: person -> painful moment -> live workflow -> outcome -> impact.
2. A 30-second product demo sequence with exactly what to click/type/say.
3. A maximum five-slide outline, if slides are allowed.
4. A one-sentence explanation of why AI is necessary.
5. An honest responsible-AI statement: data handling, human review, and limitation.
6. Five likely judge questions with grounded answers.
7. A backup plan for a failed network, API, or live demo.

Prioritize judging criteria from RULEBOOK.md. Do not invent metrics,
partnerships, users, or capabilities.
NEXT OWNER: Demo captain.
```

## 6. The Decision Gate

The product captain chooses one concept after the idea-critic report. Record the decision in `PROJECT_CONTRACT.md` using this template.

```text
# Project Contract

## Confirmed
- Theme and required integrations: [rule IDs]
- Target user: [one specific person]
- Painful moment: [what happens and why it matters]

## Chosen promise
For [target user] facing [pain], we turn [messy input] into [concrete,
useful outcome] in [time or number of steps].

## Core workflow
1. The user provides: [input].
2. The system validates or asks: [minimal clarification].
3. AI/service turns it into: [structured result].
4. The user takes: [concrete action].
5. The user sees: [outcome/proof/progress].

## Demo moment
[The before/after transformation the judges will see.]

## Non-goals / Cut list
- [feature deliberately not built]
- [feature deliberately not built]

## Evidence of rule compliance
- R[number]: [screen, test, live API behavior, or submission item]
```

Do not begin broad implementation until this is approved. A project can have ambitious future plans, but its MVP needs one end-to-end user outcome.

## 7. 24-Hour Operating Schedule

Adapt the times to the official start. This schedule assumes no prebuilt project work.

| Elapsed time | Active roles | Required outcome |
| --- | --- | --- |
| 0:00–0:15 | Humans + Rules Architect | Rulebook and organizer questions |
| 0:15–0:40 | Idea Generator + Idea Critic | Three scored concepts |
| 0:40–1:00 | Product captain + Compliance Guardian | Approved project contract and early compliance audit |
| 1:00–1:30 | Solution Architect + Build captain | Build order, stack, and fallback plan |
| 1:30–2:30 | Build Agent | Deployed shell and first visible user flow |
| 2:30–10:00 | Build Agent + Quality Agent | Working core transformation and action |
| 10:00–14:00 | Build Agent + Quality + Compliance Guardian | Required integrations, resilience, and rule evidence |
| 14:00–18:00 | Quality Agent + Demo/Pitch Agent | Polished demo path, tested fallbacks, initial pitch |
| 18:00–21:00 | Entire team | Rehearsal, bug fixes, screenshots/video if allowed |
| 21:00–23:00 | Compliance Guardian + Quality Agent | Final audit and submission validation |
| 23:00–24:00 | Humans | Submit early; make only low-risk improvements afterward |

## 8. Team Checkpoints

Hold a five-minute human checkpoint every two hours. Answer only:

1. What part of the end-to-end user journey works right now?
2. What is the single largest demo risk?
3. Which task moves from `Next` to `Cut`?
4. Which rule lacks visible evidence?
5. Is the demo still understandable in one sentence?

If an agent recommendation adds a new service, data source, page, or user type, it is automatically `Next`, not `Now`, until the product captain approves it.

## 9. Demo Reliability Protocol

Build the following before polish:

- One known-good demo account, if authentication is required.
- One known-good input that produces a useful output.
- Seeded or static sample data permitted by the rules.
- Friendly loading and error states.
- A local or recorded fallback only if the rules allow it.
- Screenshots or a screen recording of the successful workflow, when permitted.
- A fresh-browser test shortly before submission.

Never fake a required integration. If a dependency is unavailable, label the fallback honestly and explain what was verified.

## 10. Final Compliance Checklist

Run this with the Compliance Guardian and humans before submitting.

```text
[ ] We satisfy every eligibility rule in RULEBOOK.md.
[ ] The project was created within the permitted event window.
[ ] Required host tools, APIs, or technologies are used and evidenced.
[ ] The live URL/repository/demo link opens for a judge.
[ ] The core workflow works from a fresh browser.
[ ] The demo shows a real input -> AI/service transformation -> user action.
[ ] The pitch claims only what is implemented and tested.
[ ] Data, privacy, and permissions have a clear explanation.
[ ] All required fields, members, links, video, and documents are submitted.
[ ] Submission happens before the deadline with time to verify it.
```

## 11. Anti-Patterns To Avoid

- Building a generic chat interface without a concrete action or outcome.
- Letting several coding agents edit the same files without ownership.
- Treating a planned API integration as a completed one.
- Using an agent-generated feature list as a commitment.
- Waiting until the final hour to test deployment, network, login, or submission links.
- Adding a database, authentication system, multi-agent runtime, or dashboard without a core-workflow reason.
- Ignoring a `BLOCK` finding because the UI looks finished.
- Giving judges a technical tour before showing the user problem and transformation.

## 12. One-Sentence Team Rule

Build one trustworthy workflow that turns a stressful real-world input into a useful next action, prove it satisfies the rules, and make the demo impossible to misunderstand.
