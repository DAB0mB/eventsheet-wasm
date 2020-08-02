# eventsheet-wasm

An extensible custom CSS engine that implements a parser using Rust / WASM. You can find an in depth explanation about the engine in [this Medium article](https://medium.com/the-guild/i-wrote-a-customizable-css-engine-in-javascript-b1e05c8914fe); however, the article is refers to the [JS version of the engine](https://github.com/DAB0mB/eventsheet-wasm/tree/js), and a Rust / Wasm version of it should be coming soon. The purpose of this project, aside from implementing a useful CSS engine, is to compare Wasm to JS side by side with a relatively similar implementation (See [js branch](https://github.com/DAB0mB/eventsheet-wasm/tree/js)).

## Pre-requisites

Make sure you have [Rust compiler](https://www.rust-lang.org/tools/install) installed along with [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/). More info about the setup can be found [here](https://rustwasm.github.io/book/game-of-life/setup.html).

## Demo

First you need to build the demo:

    npm run build-demo

Then you need to create a public server for the generated `bundle` dir:

    serve bundle

Navigate to the address shown on screen e.g. `http://192.168.1.128:5000`. Note: DO NOT use localhost otherwise you'll get CORS related error. Copy the contents of `bundle/eventsheet-demo.js` and run it in the browser's dev-console. You should see an interactive button that says "click me" in the middle of the screen.

## License

MIT
