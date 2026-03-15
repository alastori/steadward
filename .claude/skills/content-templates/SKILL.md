---
name: content-templates
description: Templates for writing initiative cards, events, and UI copy in Steadward's tone. Use when creating new game content.
user-invocable: false
---

# Content Writing Templates

## Initiative Card Template

```typescript
{
  id: 'initiative-xxx',
  name: 'Short Name',              // 2-4 words, Title Case
  description: 'What this initiative does and why it matters.',  // 2-3 sentences, 40-60 words
  department: 'operations',         // operations | infrastructure | research | external-affairs
  attentionCost: 2,                // 1-4
  duration: 2,                     // 1-3 weeks
  requiredResources: { materials: 15 },
  outcomeOverseen: {
    resourceEffects: { materials: -15, resilience: 20 },
    description: 'What happens when you oversee this personally.',          // 1-2 sentences
    descriptionPartial: 'Partial success outcome.',
    descriptionFailure: 'What goes wrong.',
  },
  outcomeDelegated: {
    resourceEffects: { materials: -15, resilience: 12 },
    description: 'What happens when a leader handles this independently.',  // 1-2 sentences
    descriptionPartial: 'Leader-dependent partial outcome.',
    descriptionFailure: 'Leader-dependent failure.',
  },
  tags: ['base'],
}
```

**Writing rules for initiatives:**
- Description: what the player is committing resources/attention to. Be concrete.
- Overseen outcomes: better resource returns, written as direct observation.
- Delegated outcomes: depend on leader stats. Written as the leader's report.
- Never use "you" in outcome text. Use passive or third person.

## Event Template

```typescript
{
  id: 'event-xxx',
  name: 'Event Name',             // 2-5 words, Title Case
  description: 'What happened and what the player must decide.',  // 2-4 sentences, 40-80 words
  urgency: 'pressing',            // ignorable | pressing | critical
  choices: [
    {
      id: 'choice-1',
      name: 'Choice Label',       // 2-5 words
      description: 'What this choice entails.',  // 1 sentence
      attentionCost: 2,
      resourceEffects: { trust: 10, materials: -10 },
    },
    // 2-3 choices per event
  ],
  conditions: [                    // When can this event fire?
    { type: 'week_min', value: 3 },
  ],
  tags: ['base'],
}
```

**Writing rules for events:**
- Present the situation, not the "correct" answer
- Each choice has a clear tradeoff (gain X, lose Y)
- Choice text: mechanical info wrapped in narrative. Player should understand the cost.
- Outcome text: consequences, not judgment. "The water is clean" not "Good choice."

## UI Copy Style

- Mode transitions: Short, evocative. "Read the ground." / "Choose what matters." / "Steady hands." / "What held. What shifted."
- Button labels: Title Case. "Confirm Plan", "Begin Week 4"
- Resource labels: Full word, not abbreviation. "Materials" not "Mat"
- Error messages: State what can't be done and why. "Maren is already assigned to Operations."
- Empty states: Brief, not apologetic. "No new initiatives this week. Active initiatives continue."
