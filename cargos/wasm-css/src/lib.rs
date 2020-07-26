mod block;
mod node;
mod parsable;
mod query;
mod root;
mod rule;
mod utils;

use crate::parsable::Parsable;
use crate::root::Root;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn parse_css(css: &str) -> Root {
  let mut root = Root::new(&css.to_string(), 0, css.len());
  root.parse();

  root
}
