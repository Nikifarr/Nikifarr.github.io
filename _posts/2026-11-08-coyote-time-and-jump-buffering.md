---
title: "Coyote time & jump buffering"
section: design
status: evergreen
summary: "Two tiny tricks that make platformer controls feel fair, with a Godot 4 example."
tags: [game-feel, platformer, godot]
takeaways:
  - "**Coyote time**: still allow a jump for a few frames after walking off a ledge."
  - "**Jump buffering**: remember a jump pressed slightly *before* landing and fire it on touchdown."
  - "Both are invisible to players. They just make the game feel responsive instead of unfair."
---

Players don't press buttons on the exact frame we expect. These two tricks forgive that.

## Coyote time

Named after the cartoon coyote who runs off a cliff and only falls once he notices. When the player leaves a ledge, keep a short timer running (around **0.1 s**). If they press jump during that window, the jump still works.

## Jump buffering

The mirror image: if the player presses jump a moment *before* landing, store that input for a short time (around **0.1–0.15 s**). When they touch the ground, the jump fires.

## Example in Godot 4

```gdscript
extends CharacterBody2D

const SPEED := 220.0
const JUMP_VELOCITY := -420.0
const COYOTE_TIME := 0.1
const JUMP_BUFFER_TIME := 0.12

var gravity: float = ProjectSettings.get_setting("physics/2d/default_gravity")
var coyote_timer := 0.0
var jump_buffer_timer := 0.0

func _physics_process(delta: float) -> void:
	if is_on_floor():
		coyote_timer = COYOTE_TIME
	else:
		coyote_timer -= delta
		velocity.y += gravity * delta

	if Input.is_action_just_pressed("ui_accept"):
		jump_buffer_timer = JUMP_BUFFER_TIME
	else:
		jump_buffer_timer -= delta

	if jump_buffer_timer > 0.0 and coyote_timer > 0.0:
		velocity.y = JUMP_VELOCITY
		jump_buffer_timer = 0.0
		coyote_timer = 0.0

	velocity.x = Input.get_axis("ui_left", "ui_right") * SPEED
	move_and_slide()
```

## Tuning notes

- Too much coyote time and players can "jump on air". Keep it short.
- Combine with **variable jump height** (cut upward velocity when the button is released) for even better feel.
