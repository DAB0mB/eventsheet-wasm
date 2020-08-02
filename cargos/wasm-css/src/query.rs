extern crate regex;

use regex::Regex;
use crate::node::Node;
use crate::js_compatible::JsCompatible;
use crate::parsable::Parsable;

pub struct Query {
  node: Node,
  selectors: Vec<String>,
}

impl Parsable for Query {
  fn new(code: &String, start: usize, length: usize) -> Self {
    let node = Node::new(code, start, length);

    Self {
      node: node,
      selectors: vec![],
    }
  }

  fn node<'a>(&'a self) -> &'a Node {
    &self.node
  }

  fn parse(&mut self) -> bool {
    let node = &mut self.node;
    let selectors = &mut self.selectors;

    let start: usize;
    {
      let re = Regex::new(r"[^\s,]").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      start = node.start() + mat.start();
    }

    node.set_start(start);

    let length: usize;
    {
      let re = Regex::new(r"\s*[\{,]").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      length = mat.start();
    }

    node.set_length(length);

    {
      if node.code().trim() == "" {
        return false;
      }
    }

    {
      let re = Regex::new(r" +").unwrap();
      selectors.append(&mut re.split(node.code()).map(|x| x.to_string()).filter(|x| x != "").collect());
    }

    true
  }
}

impl JsCompatible for Query {
  fn to_js(&self) -> js_sys::Object {
    let js_query = js_sys::Object::new();
    js_sys::Reflect::set(&js_query, &wasm_bindgen::JsValue::from_str("type"), &wasm_bindgen::JsValue::from_str("Query"));
    js_sys::Reflect::set(&js_query, &wasm_bindgen::JsValue::from_str("start"), &wasm_bindgen::JsValue::from_f64(self.node.start() as f64));
    js_sys::Reflect::set(&js_query, &wasm_bindgen::JsValue::from_str("length"), &wasm_bindgen::JsValue::from_f64(self.node.length() as f64));

    let js_selectors = js_sys::Array::new();
    js_sys::Reflect::set(&js_query, &wasm_bindgen::JsValue::from_str("selectors"), &js_selectors);
    for selector in self.selectors.iter() {
      js_selectors.push(&selector.into());
    }

    js_query
  }
}
