# uloop

This library provides a simple game loop implementation, based on [this article](https://gafferongames.com/post/fix_your_timestep/).

The idea is to provide separate the `update` and `render` steps of the game loop, triggering `update`s at a fixed interval, but `render`s at the maximum possible frequency. On top of this, multiple updates may be dispatched before a single render, in order to allow for the game to catch up fater a lag spike. I recommend reading the article to understand the benefits of this approach.

The library works in both browser and Node environments. In a browser, it uses [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to trigger the loop. In Node, it uses [`setImmediate`](https://nodejs.org/api/timers.html#timers_setimmediate_callback_args).

### Usage

```ts
import { loop } from "uloop"

// Run anything not directly related to rendering in the `update` function,
// everything else goes into the `render` function.

function update() {
    physics();
    ai();

    if (gameOver()) {
        handle.stop();
    }
}

function render(weight) {
    // The idea is to use the weight, which is a value between 0 and 1, 
    // to interpolate between the previous and current game state.
    // This smooths .
    const state = interpolate(lastState, currentState, weight);
    draw(state);
}

// This call starts the loop, triggering an `update` ~30 times a second, 
// and triggering `render` as often as possible.
// The `loop` function returns a `handle` which may be used to stop the loop.
// Restarting it requires calling `loop` again.
let handle = loop(30, update, render);
```