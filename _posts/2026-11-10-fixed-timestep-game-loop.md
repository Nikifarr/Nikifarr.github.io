---
title: "A fixed-timestep game loop"
section: cpp
status: budding
summary: "Why game logic should update in fixed steps, and how to do it in C++ with std::chrono."
tags: [game-loop, chrono, architecture]
takeaways:
  - "Rendering can run as fast as the screen allows, but **game logic should update in fixed steps** so physics behaves the same on every machine."
  - "An **accumulator** collects real elapsed time and spends it in fixed `dt` chunks."
  - "Clamp very long frames so the game doesn't fall into the *spiral of death*."
sources:
  - title: "Fix Your Timestep!"
    url: "https://gafferongames.com/post/fix_your_timestep/"
    note: "Glenn Fiedler"
---

If you move things by `speed * frameTime`, your game behaves slightly differently at 30 FPS and at 144 FPS. Collisions can be missed, jumps can be higher or lower. A fixed timestep fixes that.

## The idea

- Measure how much real time passed since the last frame.
- Add it to an **accumulator**.
- While the accumulator holds at least one step (`dt`), run `update(dt)` and subtract `dt`.
- Render once, using what's left over to interpolate.

## In C++

```cpp
#include <chrono>

using Clock = std::chrono::steady_clock;

bool running = true;
void processInput();
void update(double dt);
void render(double alpha);

int main() {
    constexpr double dt = 1.0 / 60.0;   // 60 logic updates per second
    double accumulator = 0.0;
    auto previous = Clock::now();

    while (running) {
        auto now = Clock::now();
        double frameTime = std::chrono::duration<double>(now - previous).count();
        previous = now;

        if (frameTime > 0.25) frameTime = 0.25;  // avoid the spiral of death
        accumulator += frameTime;

        processInput();
        while (accumulator >= dt) {
            update(dt);          // logic always sees the same step
            accumulator -= dt;
        }

        double alpha = accumulator / dt;  // 0..1, how far between two updates
        render(alpha);           // blend previous and current state
    }
}
```

## Notes to self

- `steady_clock` never jumps backwards, unlike the system clock. Use it for game timing.
- For interpolation, keep the **previous** and **current** state of each object and draw `lerp(previous, current, alpha)`.
- Engines like Godot already do this for you: `_physics_process` runs at a fixed rate.
