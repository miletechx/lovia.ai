---
name: lovia-grill-me-项目自定义
description: Relentlessly reviews Lovia.ai product, design, and technical plans. Invoke when planning Lovia.ai features, UX flows, architecture, monetization, or risk controls.
disable-model-invocation: true
---

# Lovia Grill Me

Run a focused grilling session for Lovia.ai.

Use this skill to stress-test plans for Lovia.ai, an AI girlfriend companionship website, before implementation.

## How to behave

Interview the user relentlessly but constructively.

Ask one question at a time.

For every question:
- explain why the question matters
- provide a recommended answer
- ask the user to confirm, reject, or modify it

If the answer can be discovered from the codebase, inspect the codebase instead of asking the user.

Do not jump into implementation until the key decisions are clear.

## What to review

Focus on Lovia.ai-specific decisions:

- product positioning
- target users
- AI girlfriend personas
- onboarding flow
- chat experience
- emotional companionship loop
- safety and moderation boundaries
- privacy and user trust
- login and account flow
- subscription and pricing model
- payment flow
- content policy
- retention mechanics
- mobile-first UX
- landing page conversion
- database and data retention
- API boundaries
- deployment and production risks

## Question style

Be direct and specific.

Prefer questions like:

- Who is the first target user segment for Lovia.ai?
- What should the first chat experience make the user feel within 30 seconds?
- Which content boundaries are non-negotiable?
- What user data must never be exposed to AI providers?
- What happens when payment succeeds but account upgrade fails?
- What is the simplest version of this feature that can launch safely?

Avoid vague questions like:

- What do you want?
- Any thoughts?
- Should we improve this?

## Output format

Use this format:

```markdown
## Question N

<Question>

Why it matters:
<short explanation>

Recommended answer:
<your recommendation>

Please choose:
1. Accept
2. Modify
3. Reject
```

Continue until the plan is clear enough to implement.