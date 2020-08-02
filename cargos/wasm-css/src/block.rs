extern crate regex;

use regex::Regex;
use crate::node::Node;
use crate::js_compatible::JsCompatible;
use crate::parsable::Parsable;
use crate::query::Query;
use crate::rule::Rule;
use crate::utils::parse_series;

pub struct Block {
  node: Node,
  rules: Vec<Rule>,
  queries: Vec<Query>,
}

impl Parsable for Block {
  fn new(code: &String, start: usize, length: usize) -> Self {
    let node = Node::new(code, start, length);

    Self {
      node: node,
      rules: vec![],
      queries: vec![],
    }
  }

  fn node<'a>(&'a self) -> &'a Node {
    &self.node
  }

  fn parse(&mut self) -> bool {
    let node = &mut self.node;
    let queries = &mut self.queries;
    let rules = &mut self.rules;

    let start: usize;
    {
      let re = Regex::new(r"[^\s]").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      start = node.start() + mat.start();
    }

    node.set_start(start);

    let scope_start: usize;
    {
      let re = Regex::new(r"\{").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      scope_start = mat.start();
    }

    let length: usize;
    {
      let re = Regex::new(r"\}").unwrap();
      let re_found = re.find(node.code());

      if !re_found.is_some() {
        return false;
      }

      let mat = re_found.unwrap();
      length = mat.end();
    }

    node.set_length(length);

    {
      queries.append(&mut parse_series::<Query>(node.src_code(), node.start()));
      rules.append(&mut parse_series::<Rule>(node.src_code(), node.start() + scope_start + 1));
    }

    {
      if node.code().trim() == "" {
        return false;
      }
    }

    true
  }
}

impl JsCompatible for Block {
  fn to_js(&self) -> js_sys::Object {
    let js_block = js_sys::Object::new();
    js_sys::Reflect::set(&js_block, &wasm_bindgen::JsValue::from_str("type"), &wasm_bindgen::JsValue::from_str("Block"));
    js_sys::Reflect::set(&js_block, &wasm_bindgen::JsValue::from_str("start"), &wasm_bindgen::JsValue::from_f64(self.node.start() as f64));
    js_sys::Reflect::set(&js_block, &wasm_bindgen::JsValue::from_str("length"), &wasm_bindgen::JsValue::from_f64(self.node.length() as f64));

    let js_rules = js_sys::Array::new();
    js_sys::Reflect::set(&js_block, &wasm_bindgen::JsValue::from_str("rules"), &js_rules);
    for rule in self.rules.iter() {
      js_rules.push(&rule.to_js());
    }

    let js_queries = js_sys::Array::new();
    js_sys::Reflect::set(&js_block, &wasm_bindgen::JsValue::from_str("queries"), &js_queries);
    for query in self.queries.iter() {
      js_queries.push(&query.to_js());
    }

    js_block
  }
}
