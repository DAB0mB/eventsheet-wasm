use crate::block::Block;
use crate::node::Node;
use crate::parsable::Parsable;
use crate::utils::parse_series;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
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
