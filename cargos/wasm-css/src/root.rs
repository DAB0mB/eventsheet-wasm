use crate::block::Block;
use crate::node::Node;
use crate::parsable::Parsable;
use crate::js_bind::JsBind;
use crate::utils::parse_series;

pub struct Root {
  node: Node,
  blocks: Vec<Block>,
}

impl Parsable for Root {
  fn new(code: &String, start: usize, length: usize) -> Self {
    let node = Node::new(code, start, length);

    Self {
      node: node,
      blocks: vec![],
    }
  }

  fn node<'a>(&'a self) -> &'a Node {
    &self.node
  }

  fn parse(&mut self) -> bool {
    let mut blocks: Vec<Block>;
    {
      let node = &self.node();
      blocks = parse_series::<Block>(node.code(), node.start());
    }

    self.blocks.append(&mut blocks);

    true
  }
}

impl JsBind for Root {
  fn js_bind(&self) -> js_sys::Object {
    let js_root = js_sys::Object::new();
    js_sys::Reflect::set(&js_root, &wasm_bindgen::JsValue::from_str("type"), &wasm_bindgen::JsValue::from_str("Root"));
    js_sys::Reflect::set(&js_root, &wasm_bindgen::JsValue::from_str("start"), &wasm_bindgen::JsValue::from_f64(self.node.start() as f64));
    js_sys::Reflect::set(&js_root, &wasm_bindgen::JsValue::from_str("length"), &wasm_bindgen::JsValue::from_f64(self.node.length() as f64));

    let js_blocks = js_sys::Array::new();
    js_sys::Reflect::set(&js_root, &wasm_bindgen::JsValue::from_str("blocks"), &js_blocks);
    for block in self.blocks.iter() {
      js_blocks.push(&block.js_bind());
    }

    js_root
  }
}
