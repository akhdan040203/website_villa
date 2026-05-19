# Nakula: Bali Villa Management and Private Villas

## Mission
Create implementation-ready, token-driven UI guidance for Nakula: Bali Villa Management and Private Villas that is optimized for consistency, accessibility, and fast delivery across documentation site.

## Brand
- Product/brand: Nakula: Bali Villa Management and Private Villas
- URL: https://nakula.com/?utm_medium=cpc&utm_content=&gad_source=1&gad_campaignid=23376243554&gbraid=0AAAABB6MiImrIVxm7gyJyUQ7qaNqrvugO&gclid=Cj0KCQjwzqXQBhD2ARIsAKrIeU9E3uqW9y0d3Vw0vzWrEJMacNCUk6oidg61qo12zEwJsUOmlDmFdocaAqaxEALw_wcB
- Audience: developers and technical teams
- Product surface: documentation site

## Style Foundations
- Visual style: clean, functional, implementation-oriented
- Main font style: `font.family.primary=__Philosopher_d388e14`, `font.family.stack=__Philosopher_d388e14, __Philosopher_Fallback_d388e14`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=0px`, `font.size.sm=10px`, `font.size.md=12px`, `font.size.lg=14px`, `font.size.xl=16px`, `font.size.2xl=20px`, `font.size.3xl=42px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=#261607`, `color.surface.base=#000000`, `color.text.inverse=#906b3e`, `color.surface.raised=#ece6e3`, `color.border.default=#e5e7eb`
- Spacing scale: `space.1=2px`, `space.2=3px`, `space.3=4px`, `space.4=8px`, `space.5=10px`, `space.6=12px`, `space.7=14px`, `space.8=16px`
- Radius/shadow/motion tokens: `radius.xs=24px`, `radius.sm=50px`, `radius.md=9999px` | `shadow.1=rgb(255, 255, 255) 0px 0px 0px 0px, rgba(59, 130, 246, 0.5) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.12) 0px 4px 10px 0px`, `shadow.3=rgba(0, 0, 0, 0.2) 1px 2px 8px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=300ms`, `motion.duration.slow=500ms`, `motion.duration.slower=700ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
Concise, confident, implementation-focused.

## Rules: Do
- Use semantic tokens, not raw hex values, in component guidance.
- Every component must define states for default, hover, focus-visible, active, disabled, loading, and error.
- Component behavior should specify responsive and edge-case handling.
- Interactive components must document keyboard, pointer, and touch behavior.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.
- Do not ship component guidance without explicit state rules.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and semantic tokens.
3. Define component anatomy, variants, interactions, and state behavior.
4. Add accessibility acceptance criteria with pass/fail checks.
5. Add anti-patterns, migration notes, and edge-case handling.
6. End with a QA checklist.

## Required Output Structure
- Context and goals.
- Design tokens and foundations.
- Component-level rules (anatomy, variants, states, responsive behavior).
- Accessibility requirements and testable acceptance criteria.
- Content and tone standards with examples.
- Anti-patterns and prohibited implementations.
- QA checklist.

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.
- Include known page component density: links (91), buttons (83), inputs (33), lists (25), cards (8), navigation (3).

- Extraction diagnostics: Audience and product surface inference confidence is low; verify generated brand context.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Teams should prefer system consistency over local visual exceptions.
