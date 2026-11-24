---
title: "The MDA framework"
section: design
status: budding
summary: "Mechanics → Dynamics → Aesthetics: a lens for thinking about how rules turn into player experiences."
tags: [frameworks, theory, player-experience]
takeaways:
  - "**Mechanics** are the rules and data. **Dynamics** are what happens when players use them. **Aesthetics** are the feelings that result."
  - "Designers build from mechanics up; players experience the game from aesthetics down."
  - "Pick the aesthetics you want *first*, then design mechanics that produce them."
sources:
  - title: "MDA: A Formal Approach to Game Design and Game Research"
    note: "Hunicke, LeBlanc & Zubek, 2004"
---

MDA is one of the most cited frameworks in game design. It splits a game into three layers that build on each other.

## The three layers

| Layer | What it is | Example (a platformer) |
|---|---|---|
| **Mechanics** | Rules, actions, numbers, data | Jump height, gravity, enemy patrol routes |
| **Dynamics** | Behavior that emerges at runtime | Players timing jumps around patrols, speedrunning shortcuts |
| **Aesthetics** | The emotional response | Challenge, mastery, flow |

## Two directions

The key insight is that **designers and players look at the game from opposite ends**:

- The **designer** controls mechanics directly. Dynamics and aesthetics are only reachable *indirectly*.
- The **player** feels the aesthetics first and may never think about the mechanics at all.

This is why tweaking a single number (say, jump gravity) can change how the whole game *feels*.

## The eight aesthetics

The paper suggests a vocabulary for "fun" so we can be more specific than just "fun":

1. **Sensation**: game as sense-pleasure
2. **Fantasy**: game as make-believe
3. **Narrative**: game as drama
4. **Challenge**: game as obstacle course
5. **Fellowship**: game as social framework
6. **Discovery**: game as uncharted territory
7. **Expression**: game as self-discovery
8. **Submission**: game as pastime

## My thoughts

> Try this: pick a game you love, name its top two aesthetics, then trace which mechanics create them.

Questions I still have:

- How does MDA handle narrative-heavy games where the "mechanics" are mostly dialogue choices?
- Later frameworks (like DDE) criticize MDA. Worth a separate note.
