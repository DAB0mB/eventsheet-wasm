mod block;
mod js_compatible;
mod node;
mod parsable;
mod query;
mod root;
mod rule;
mod utils;

use crate::parsable::Parsable;
use crate::js_compatible::JsCompatible;
use crate::root::Root;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse(css: &str) -> wasm_bindgen::JsValue {
  /*
    ## DEV NOTES

    To use `console.log`():

        web_sys::console::log_1(&format!("message {}", value).into());

    To emit errors using `console.error()`:

        #[cfg(feature = "console_error_panic_hook")]
        console_error_panic_hook::set_once();
  */

  let mut root = Root::new(&css.to_string(), 0, css.len());
  root.parse();

  root.to_js().into()
}
